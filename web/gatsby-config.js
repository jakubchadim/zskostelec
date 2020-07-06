module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-ts-config`,
      options: {
        projectRoot: __dirname,
        configDir: '.gatsby'
      }
    }
  ]
}
