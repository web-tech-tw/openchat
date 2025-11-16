import type {UserProfile} from "~/composables/useProfile.client"

export const title = "OpenChat Hub"
export const subtitle = "臺灣網際網路技術推廣組織"
export const label = "OpenChat Hub"

export const isSaraEnabled = false
export const onClickSara = (_profile: UserProfile | null = null): void => {
  const {
    public: publicConfig,
  } = useRuntimeConfig()

  const {
    saraInteHost,
  } = publicConfig

  location.assign(saraInteHost)
}

export interface MenuDropdownChild {
  name: string
  description: string
  icon: string
  onClick: () => void
}

export interface MenuDropdownItem {
  name: string
  type: "dropdown"
  status: string
  children: MenuDropdownChild[]
}

export interface MenuFunctionItem {
  name: string
  type: "function"
  icon: string
  onClick: () => void
}

export type MenuItem = MenuDropdownItem | MenuFunctionItem

export const menuItems: MenuItem[] = [
  {
    name: "社群列表",
    type: "function",
    icon: "/icons/collection.svg",
    onClick: () => {
      if (import.meta.client) {
        navigateTo('/join')
      }
    }
  },
  {
    name: "社群規範",
    type: "function",
    icon: "/icons/information-circle.svg",
    onClick: () => {
      if (import.meta.client) {
        navigateTo('/rule')
      }
    }
  },
  {
    name: "社群管理",
    type: "function",
    icon: "/icons/shield-check.svg",
    onClick: () => {
      if (import.meta.client) {
        navigateTo('/admin')
      }
    }
  },
  {
    name: "回首頁",
    type: "function",
    icon: "/icons/home.svg",
    onClick: () => {
      if (import.meta.client) {
        location.assign("https://web-tech.tw")
      }
    }
  }
]
