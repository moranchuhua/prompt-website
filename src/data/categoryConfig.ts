// src/data/categoryConfig.ts
import type { MainCategoryConfig } from '../types';

// 一级按钮配置 - 添加 NSFW 标志
export const mainCategoryConfigs: MainCategoryConfig[] = [
  {
    id: 'composition',
    label: '构图和风格',
    icon: '📐',
    nsfw: false,
    subCategories: [
      { key: 'atisticlicense', label: '艺术许可', fileName: 'atisticlicense', nsfw: false },
      { key: 'imagecomposition', label: '图像构成', fileName: 'imagecomposition', nsfw: false },
      { key: 'backgrounds', label: '背景', fileName: 'backgrounds', nsfw: false },
      { key: 'censorship', label: '审查制度', fileName: 'censorship', nsfw: false },
      { key: 'colors', label: '颜色', fileName: 'colors', nsfw: false },
      { key: 'fineartparody', label: '美术模仿', fileName: 'fineartparody', nsfw: false },
      { key: 'charactercount', label: '字符数', fileName: 'charactercount', nsfw: false },

      
      
      { key: 'patterns', label: '图案', fileName: 'patterns', nsfw: false },
      { key: 'symbols', label: '符号', fileName: 'symbols', nsfw: false },
      { key: 'text', label: '文本', fileName: 'text', nsfw: false },
      { key: 'japanesedialects', label: '日语方言', fileName: 'japanesedialects', nsfw: false },
      { key: 'yeartags', label: '年份标签', fileName: 'yeartags', nsfw: false },
    ]
  },
  {
    id: 'body',
    label: '身体',
    icon: '🧍',
    nsfw: false,
    subCategories: [
      { key: 'bodyparts', label: '身体部位', fileName: 'bodyparts', nsfw: false },
      { key: 'ass', label: '臀部', fileName: 'ass', nsfw: true },
      { key: 'breasts', label: '胸部', fileName: 'breasts', nsfw: false },
      { key: 'face', label: '面部', fileName: 'face', nsfw: false },
      { key: 'ears', label: '耳朵', fileName: 'ears', nsfw: false },
      { key: 'eyes', label: '眼镜', fileName: 'eyes', nsfw: false },
      { key: 'eyebrows', label: '眉毛', fileName: 'eyebrows', nsfw: false },
      { key: 'nose', label: '鼻子', fileName: 'nose', nsfw: false },
      { key: 'hair', label: '头发', fileName: 'hair', nsfw: false },
      { key: 'haircolor', label: '发色', fileName: 'haircolor', nsfw: false },
      { key: 'hairstyles', label: '发型', fileName: 'hairstyles', nsfw: false },
      { key: 'hand', label: '手', fileName: 'hand', nsfw: false },
      { key: 'gestures', label: '手势', fileName: 'gestures', nsfw: false },
      { key: 'feet', label: '脚', fileName: 'feet', nsfw: false },
      { key: 'neck', label: '脚颈部和领饰', fileName: 'neck', nsfw: false },
      { key: 'on', label: '位置', fileName: 'on', nsfw: false },
      { key: 'posture', label: '姿势', fileName: 'posture', nsfw: false },
      { key: 'pussy', label: '阴部', fileName: 'pussy', nsfw: true },
      { key: 'penis', label: '阴茎', fileName: 'penis', nsfw: true },
      { key: 'shoulders', label: '肩膀', fileName: 'shoulders', nsfw: false },
      { key: 'skincolor', label: '肤色', fileName: 'skincolor', nsfw: false },
      { key: 'tail', label: '尾巴', fileName: 'tail', nsfw: false },
      { key: 'wings', label: '翅膀', fileName: 'wings', nsfw: false },
      { key: 'injury', label: '受伤', fileName: 'injury', nsfw: false },
    ]
  },
  {
    id: 'apparel',
    label: '服装和身体饰品',
    icon: '👕',
    nsfw: false,
    subCategories: [
      { key: 'accessories', label: '配饰', fileName: 'accessories', nsfw: false },
      { key: 'attire', label: '服装', fileName: 'attire', nsfw: false },
      { key: 'dress', label: '裙子', fileName: 'dress', nsfw: false },
      { key: 'handwear', label: '手部穿戴', fileName: 'handwear', nsfw: false },
      { key: 'headwear', label: '头饰', fileName: 'headwear', nsfw: false },
      { key: 'legwear', label: '腿部服装', fileName: 'legwear', nsfw: false },
      { key: 'mask', label: '面具', fileName: 'mask', nsfw: false },
      { key: 'neckwear', label: '颈部及颈部饰品', fileName: 'neckwear', nsfw: false },
      { key: 'sexualattire', label: '性吸引力', fileName: 'sexualattire', nsfw: true },
      { key: 'bra', label: '胸罩', fileName: 'bra', nsfw: false },
      { key: 'panties', label: '内裤', fileName: 'panties', nsfw: false },
      { key: 'sleeves', label: '袖子', fileName: 'sleeves', nsfw: false },
      { key: 'swimsuit', label: '泳装', fileName: 'swimsuit', nsfw: false },
      { key: 'embellishment', label: '装饰', fileName: 'embellishment', nsfw: false },
      { key: 'eyewear', label: '眼镜', fileName: 'eyewear', nsfw: false },
      { key: 'fashionstyle', label: '时尚风格', fileName: 'fashionstyle', nsfw: false },
      { key: 'makeup', label: '化妆', fileName: 'makeup', nsfw: false },
      { key: 'covering', label: '遮挡', fileName: 'covering', nsfw: false },
      { key: 'nudity', label: '裸露', fileName: 'nudity', nsfw: true },
    ]
  },
  {
    id: 'sex',
    label: '性',
    icon: '🔞',
    nsfw: true,
    subCategories: [
      { key: 'sexacts', label: '性行为', fileName: 'sexacts', nsfw: true },
      { key: 'simulatedsexacts', label: '模拟性行为', fileName: 'simulatedsexacts', nsfw: true },
      { key: 'sexualpositions', label: '性爱姿势', fileName: 'sexualpositions', nsfw: true },
      { key: 'bdsm', label: '虐恋和酷刑', fileName: 'bdsm', nsfw: true },
    ]
  },
  {
    id: 'objects',
    label: '物品',
    icon: '📦',
    nsfw: false,
    subCategories: [
      { key: 'airplanes', label: '飞机', fileName: 'airplanes', nsfw: false },
      { key: 'armor', label: '盔甲', fileName: 'armor', nsfw: false },
      { key: 'vehicles', label: '车辆', fileName: 'vehicles', nsfw: false },
      { key: 'helicopters', label: '直升机', fileName: 'helicopters', nsfw: false },
      { key: 'ships', label: '船舶', fileName: 'ships', nsfw: false },
      { key: 'weapons', label: '武器', fileName: 'weapons', nsfw: false },
      { key: 'audio', label: '音频', fileName: 'audio', nsfw: false },
      { key: 'cards', label: '卡片', fileName: 'cards', nsfw: false },
      { key: 'playingcard', label: '扑克牌', fileName: 'playingcard', nsfw: false },
      { key: 'doors', label: '门', fileName: 'doors', nsfw: false },
      { key: 'eyewear', label: '眼镜', fileName: 'eyewear', nsfw: false },
      { key: 'piercings', label: '穿孔', fileName: 'piercings', nsfw: false },
      { key: 'sexobjects', label: '性物品', fileName: 'sexobjects', nsfw: true },
    ]
  },
  {
    id: 'creatures',
    label: '生物',
    icon: '🦊',
    nsfw: false,
    subCategories: [
      { key: 'animals', label: '动物', fileName: 'animals', nsfw: false },
      { key: 'birds', label: '鸟类', fileName: 'birds', nsfw: false },
      { key: 'cats', label: '猫', fileName: 'cats', nsfw: false },
      { key: 'dogs', label: '狗', fileName: 'dogs', nsfw: false },
      { key: 'legendary', label: '传奇生物', fileName: 'legendary', nsfw: false },
    ]
  },
  {
    id: 'plants',
    label: '植物',
    icon: '🌳',
    nsfw: false,
    subCategories: [
      { key: 'plant', label: '植物', fileName: 'plant', nsfw: false },
      { key: 'tree', label: '树', fileName: 'tree', nsfw: false },
      { key: 'flowers', label: '花卉', fileName: 'flowers', nsfw: false },
    ]
  },
  {
    id: 'realword',
    label: '现实世界',
    icon: '🌍',
    nsfw: false,
    subCategories: [
      { key: 'companies', label: '公司/品牌', fileName: 'companies', nsfw: false },
      { key: 'holidays', label: '节日', fileName: 'holidays', nsfw: false },
      { key: 'jobs', label: '工作', fileName: 'jobs', nsfw: false },
      { key: 'locations', label: '地点', fileName: 'locations', nsfw: false },
    ]
  }
];

// 导出主按钮列表（用于左侧面板）
export const mainButtons = mainCategoryConfigs.map(({ id, label, icon, nsfw }) => ({
  id,
  label,
  icon,
  nsfw
}));