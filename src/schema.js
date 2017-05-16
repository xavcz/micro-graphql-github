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
      // fetch repositories data
      const rawResponses = await Promise.all(
        repoNames.map(name => fetch(`https://api.github.com/repos/${name}`))
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
        name: repo.full_name,
        description: repo.description,
        image: repo.owner.avatar_url,
        // color: primaryColors[index],
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
      }));
    },
  },
};

module.exports = makeExecutableSchema({ typeDefs, resolvers });
