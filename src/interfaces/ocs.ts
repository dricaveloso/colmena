export interface CreateUserInterface {
  ocs: {
    meta: {
      status: string;
      statuscode: number;
      message: string;
    };
    data: {
      id: string;
    };
  };
}

export interface WelcomeUserInterface {
  ocs: {
    meta: {
      status: string;
      statuscode: number;
      message: string;
    };
    data: [];
  };
}

export interface AppPasswordInterface {
  headers: {
    "set-cookie": string[];
  };
  data: {
    ocs: {
      meta: {
        status: string;
        statuscode: number;
        message: string;
      };
      data: {
        apppassword: string;
      };
    };
  };
}

export interface UserInfoInterface {
  data: {
    ocs: {
      meta: {
        status: string;
        statuscode: number;
        message: string;
      };
      data: {
        enabled: boolean;
        storageLocation: string;
        id: string;
        lastLogin: number;
        backend: string;
        subadmin: string[];
        quota: {
          free: number;
          used: number;
          total: number;
          relative: number;
          quota: number;
        };
        avatarScope: string;
        email: string;
        emailScope: string;
        displaynameScope: string;
        phone: string;
        phoneScope: string;
        address: string;
        addressScope: string;
        website: string;
        websiteScope: string;
        twitter: string;
        twitterScope: string;
        groups: string[];
        language: string;
        locale: string;
        backendCapabilities: {
          setDisplayName: boolean;
          setPassword: boolean;
        };
        "display-name": string;
      };
    };
  };
}

export interface CapabilitiesInfoInterface {
  data: {
    ocs: {
      meta: {
        status: string;
        statuscode: number;
        message: string;
      };
      data: {
        capabilities: {
          theming: {
            name: string;
            url: string;
            slogan: string;
            color: string;
            "color-text": string;
            "color-element": string;
            "color-element-bright": string;
            "color-element-dark": string;
            logo: string;
            background: string;
            "background-plain": string;
            "background-default": string;
            logoheader: string;
            favicon: string;
          };
        };
      };
    };
  };
}

export interface AuthTokenInterface {
  token: string;
  loginName: string;
  deviceToken: {
    id: number;
    name: string;
    lastActivity: number;
    type: number;
    scope: {
      filesystem: boolean;
    };
    canDelete: boolean;
    canRename: boolean;
  };
}

export interface DefaultViewInterface {
  headers: {
    "set-cookie": string[];
  };
  data: string;
}
