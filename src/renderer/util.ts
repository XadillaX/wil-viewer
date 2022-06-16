import * as path from 'path-browserify';

const wilFileTypeMap: { [key: string]: string } = {
  'stateitem.wil': '物品在身上的显示外观',
  'items.wil': '物品在背包的显示外观',
  'dnitems.wil': '物品在地上的显示外观',
  'npc.wil': 'NPC 动作外观',
  'mmap.wil': '小地图显示外观',
  'chrsel.wil': '游戏登陆界面',
  'hair.wil': '头发动作外外观',
  'smtiles.wil': '地图图库',
  'tiles.wil': '地面外观',
};

export function getWILFileType(filename: string): string {
  filename = path.basename(filename.toLowerCase());
  if (wilFileTypeMap[filename]) {
    return wilFileTypeMap[filename];
  }

  if (/weapon(\d*)\.wil/.test(filename)) {
    return '武器动作外观';
  }

  if (/hum(\d*)\.wil/.test(filename)) {
    return '穿上衣服的动作外观';
  }

  if (/mon(\d*)\.wil/.test(filename)) {
    return '怪物动作外观';
  }

  if (/magic(\d*)\.wil/.test(filename)) {
    return '技能动作外观';
  }

  if (/objects(\d*)\.wil/.test(filename)) {
    return '大地图图库';
  }

  if (/prguse(\d*)\.wil/.test(filename)) {
    return '游戏界面';
  }

  return '自定义';
}
