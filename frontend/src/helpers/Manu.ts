import { HORIZONTAL_MENU_ITEM, MENU_ITEMS } from '../assets/data/menu-items'
import { MenuItemType } from '../types/menu'

export const getMenuItems = (): MenuItemType[] => {
  return MENU_ITEMS
}
export const getHorizontalMenuItems = (): MenuItemType[] => {
  return HORIZONTAL_MENU_ITEM
}

export const findAllParent = (
  menuItems: MenuItemType[],
  menuItem: MenuItemType,
  visited: Set<string> = new Set()
): string[] => {
  if (!menuItem.parentKey || visited.has(menuItem.key)) {
    return []
  }

  visited.add(menuItem.key)
  const parent = findMenuItem(menuItems, menuItem.parentKey)
  if (!parent) {
    return []
  }

  return [parent.key, ...findAllParent(menuItems, parent, visited)]
}

export const getMenuItemFromURL = (items: MenuItemType | MenuItemType[], url: string): MenuItemType | undefined => {
  if (items instanceof Array) {
    for (const item of items) {
      const foundItem = getMenuItemFromURL(item, url)
      if (foundItem) {
        return foundItem
      }
    }
  } else {
    if (items.url == url) return items
    if (items.children != null) {
      for (const item of items.children) {
        if (item.url == url) return item
      }
    }
  }
}

export const findMenuItem = (menuItems: MenuItemType[] | undefined, menuItemKey: MenuItemType['key'] | undefined): MenuItemType | null => {
  if (menuItems && menuItemKey) {
    for (const item of menuItems) {
      if (item.key === menuItemKey) {
        return item
      }
      const found = findMenuItem(item.children, menuItemKey)
      if (found) return found
    }
  }
  return null
}


