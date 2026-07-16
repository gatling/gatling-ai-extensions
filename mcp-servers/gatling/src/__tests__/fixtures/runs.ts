export default {
  metadata: {
    dynamic: {
      description: () => {
        const hash = Math.floor(Math.random() * Math.pow(2, 32)).toString(16);
        return `run description from jest (${hash})`;
      },
      title: () => {
        const hash = Math.floor(Math.random() * Math.pow(2, 32)).toString(16);
        return `run title from jest (${hash})`;
      }
    },
    static: {
      description: "run description from jest",
      title: "run title from jest"
    }
  }
};
