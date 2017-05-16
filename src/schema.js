const fetch = require('node-fetch');
const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = [
  `
type Repository {
  id: String
  name: String
  description: String
  image: String
  # color: String
  stars: Int
  forks: Int
  url: String
}

type Query {
  repositories: [Repository]
}
`,
];

const repoNames = [
  'VulcanJS/Vulcan',
  'storybooks/storybook',
  'apollographql/meteor-integration',
  'partyparrot/codetours',
];

const resolvers = {
  Query: {
    repositories: async () => {
      try {
        // fetch repositories data
        const rawResponses = await Promise.all(
          repoNames.map(name =>
            fetch(`https://api.github.com/repos/${name}?access_token=${process.env.GITHUB_TOKEN}`)
          )
        );

        // transform responses in exploitable JSON
        const repositories = await Promise.all(rawResponses.map(res => res.json()));

        // // get color palettes for each logo
        // const rawPalettes = await Promise.all(
        //   repositories.map(({ owner: { avatar_url } }) =>
        //     fetch('https://micro-color-palette-lfupybrqsd.now.sh', {
        //       method: 'POST',
        //       body: JSON.stringify({ src: avatar_url }),
        //     })
        //   )
        // );

        // // transform responses in exploitable JSON
        // const palettes = await Promise.all(rawPalettes.map(res => res.json()));

        // // extract the primary color
        // const primaryColors = palettes.map(([primaryColor]) => primaryColor);

        return repositories.map((repo /*, index */) => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          image: repo.name.includes('codetours')
            ? 'https://www.codetours.xyz/icon.png' // the org logo doesn't render well for this repo
            : repo.owner.avatar_url,
          // color: primaryColors[index],
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          url: repo.html_url,
        }));
      } catch (e) {
        console.log(e.stack); // eslint-disable-line
        throw Error(e);
      }
    },
  },
};

module.exports = makeExecutableSchema({ typeDefs, resolvers });
