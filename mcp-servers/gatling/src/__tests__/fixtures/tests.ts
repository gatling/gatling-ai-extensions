import sourceRepositories from "@src/__tests__/fixtures/sourceRepositories.js";

export const createOneArgs = {
  name: "[R&D] sample test",
  distribution: {
    loadGenerators: [
      {
        locationId: "prl_rnd_x86_zulu25",
        instance: {
          count: 1
        }
      }
    ]
  },
  execution: {
    meaningfulTimeWindow: {
      rampUpSeconds: 0,
      rampDownSeconds: 0
    },
    systemProperties: {},
    environmentVariables: {},
    ignoreGlobalProperties: false,
    stopCriteria: []
  },
  source: {
    sourceRepositoryId: sourceRepositories.js._id,
    buildTool: {
      type: "maven"
    },
    workingDirectory: "simulations/dummy",
    simulation: "example.BasicSimulation",
    type: "build_from_sources"
  }
};

export const patchOneName = "[R&D] sample test (modified by jest)";

export const startOneArgs = {
  testId: "test_85oi617ymtnz3ctq76thr9pyey",
  title: "stoppable run title from jest",
  description: "stoppable run description from jest",
  extra: {
    systemProperties: {
      duration: "60"
    }
  }
};

export default {
  creditless: {
    _id: "test_i1trqrufttbajk335nmi3kzd1w",
    runs: {
      read: {
        // has no metrics
        _id: "run_d6s4akhk47n3j8ehfjehompebe"
      }
    }
  },
  dummy: {
    _id: "test_85oi617ymtnz3ctq76thr9pyey",
    name: "[R&D] dummy test",
    runs: {
      read: {
        _id: "run_apgaujoaot8k7f84we61s6dhxy",
        updatedAt: "2026-07-01T00:00:00.000Z"
      },
      patch: {
        _id: "run_mj5dgse66jd1xd6thggogooknr"
      },
      reports: {
        // without groups
        _id: "run_g3b47zg19fn19cjfk7kbax1hzc"
      }
    }
  },
  ecomm: {
    _id: "test_3o7i4ygjri8dum9ijhiu8stphr",
    runs: {
      read: {
        _id: "run_abs1seqxxpb6dm11bxab7beipw",
        status: "assertions_successful"
      },
      reports: {
        // has groups
        _id: "run_jtpid9qgiff9786dprmhosa5uc"
      }
    }
  }
};
