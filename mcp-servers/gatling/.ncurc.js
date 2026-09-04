export default {
  // Keep @types/node locked to the current major (our Node LTS target);
  // let every other dependency check for latest across majors as usual.
  target: (packageName) => (packageName === "@types/node" ? "minor" : "latest")
};
