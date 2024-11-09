import router from "../router/index.js";

export const title = "OpenChat Hub";
export const subtitle = "自由的資訊科技技術社群";

export const isSaraEnabled = true;
export const onClickSara = () => {
  const {
    VITE_SARA_INTE_HOST: saraInteHost,
  } = import.meta.env;
  location.assign(saraInteHost);
};

export const menuItems = [
  {
    name: "社群列表",
    type: "function",
    icon: "FolderOpenIcon",
    onClick: () => {
      router.push("/join");
    }
  },
  {
    name: "社群規範",
    type: "function",
    icon: "InformationCircleIcon",
    onClick: () => {
      router.push("/rule");
    }
  },
  {
    name: "社群管理",
    type: "function",
    icon: "ShieldCheckIcon",
    onClick: () => {
      router.push("/admin");
    }
  }
];
