import type { PromptItem } from '../../types';

export const items: PromptItem[] = [
  // Types of Makeup
  { chinese: "唇膏", english: "lipstick" },
  { chinese: "唇彩", english: "lipgloss" },
  { chinese: "腮红", english: "rouge (makeup)" },
  { chinese: "眼线", english: "eyeliner" },
  { chinese: "眼影", english: "eyeshadow" },
  { chinese: "下眼影", english: "eyeshadow under eye" },
  { chinese: "烟熏眼影", english: "smokey eyeshadow" },
  { chinese: "睫毛膏", english: "mascara" },
  { chinese: "高光", english: "highlighter" },
  { chinese: "古铜粉", english: "bronzer" },
  { chinese: "闪粉彩妆", english: "glitter makeup" },
  { chinese: "辣妹妆", english: "gyaru makeup" },

  // Applying Makeup
  { chinese: "自己上妆", english: "applying own makeup" },
  { chinese: "给别人上妆", english: "applying another's makeup" },
  { chinese: "女同化妆梗", english: "lesbians doing makeup (meme)" },
  { chinese: "涂唇膏的姿势", english: "applying lipstick" },
  { chinese: "用粉扑涂腮红", english: "applying rouge with a powder puff" },
  { chinese: "涂唇彩", english: "applying lipgloss" },
  { chinese: "画眼线", english: "applying eyeliner" },
  { chinese: "用化妆刷涂眼影", english: "applying eyeshadow" },
  { chinese: "用睫毛刷涂睫毛膏", english: "applying mascara" },

  // Other Makeup Actions
  { chinese: "晕妆", english: "runny makeup" },
  { chinese: "蹭花的唇膏", english: "smeared lipstick" },
  { chinese: "唇印", english: "lipstick mark" },
  { chinese: "过多唇印", english: "too many lipstick marks" },
  { chinese: "唇膏写字", english: "lipstick writing" },

  // Objects and Scenery
  { chinese: "唇膏管", english: "lipstick tube" },
  { chinese: "唇釉刷头", english: "doe-foot applicator" },
  { chinese: "化妆刷", english: "makeup brush" },
  { chinese: "美妆蛋", english: "makeup sponge" },
  { chinese: "粉扑", english: "powder puff" },
  { chinese: "睫毛刷", english: "mascara wand" },
  { chinese: "睫毛夹", english: "eyelash curler" },
  { chinese: "粉饼盒", english: "compact (cosmetics)" },
  { chinese: "手镜", english: "hand mirror" },
  { chinese: "彩妆盘", english: "makeup palette" },
  { chinese: "梳妆台", english: "vanity table" },
  { chinese: "化妆间", english: "dressing room" },
  { chinese: "化妆镜灯", english: "marquee lights" },
  { chinese: "炸裂彩妆", english: "exploded cosmetics" },

  // Object Actions
  { chinese: "手持唇膏管", english: "holding lipstick tube" },
  { chinese: "手持粉饼盒", english: "holding compact" },
  { chinese: "手持化妆刷", english: "holding makeup brush" },
  { chinese: "手持彩妆盘", english: "holding makeup palette" },

  // Colors - Lips
  { chinese: "红唇", english: "red lips" },
  { chinese: "橙唇", english: "orange lips" },
  { chinese: "黄唇", english: "yellow lips" },
  { chinese: "绿唇", english: "green lips" },
  { chinese: "水蓝唇", english: "aqua lips" },
  { chinese: "蓝唇", english: "blue lips" },
  { chinese: "紫唇", english: "purple lips" },
  { chinese: "粉唇", english: "pink lips" },
  { chinese: "白唇", english: "white lips" },
  { chinese: "灰唇", english: "grey lips" },
  { chinese: "黑唇", english: "black lips" },
  { chinese: "多色唇", english: "multicolored lips" },
  { chinese: "双色唇", english: "two-tone lips" },

  // Colors - Eyeshadow
  { chinese: "红色眼影", english: "red eyeshadow" },
  { chinese: "橙色眼影", english: "orange eyeshadow" },
  { chinese: "黄色眼影", english: "yellow eyeshadow" },
  { chinese: "绿色眼影", english: "green eyeshadow" },
  { chinese: "水蓝色眼影", english: "aqua eyeshadow" },
  { chinese: "蓝色眼影", english: "blue eyeshadow" },
  { chinese: "紫色眼影", english: "purple eyeshadow" },
  { chinese: "粉色眼影", english: "pink eyeshadow" },
  { chinese: "白色眼影", english: "white eyeshadow" },
  { chinese: "灰色眼影", english: "grey eyeshadow" },
  { chinese: "黑色眼影", english: "black eyeshadow" },
  { chinese: "多色眼影", english: "multicolored eyeshadow" },
  { chinese: "双色眼影", english: "two-tone eyeshadow" },
  { chinese: "渐变色眼影", english: "gradient eyeshadow" },

  // Colors - Eyelashes
  { chinese: "彩色睫毛", english: "colored eyelashes" },

  // Mismatches
  { chinese: "不协调的眼影", english: "mismatched eyeshadow" },
  { chinese: "不协调的睫毛", english: "mismatched eyelashes" },

  // Related tags
  { chinese: "润唇膏", english: "lip balm" },
  { chinese: "脸上贴纸", english: "sticker on face" },
  { chinese: "卧蚕", english: "aegyo sal" },
  { chinese: "引眉", english: "hikimayu" },
  { chinese: "发卷", english: "hair rollers" },
  { chinese: "指甲油", english: "nail polish" },
  { chinese: "脚指甲油", english: "toenail polish" },
  { chinese: "指甲油", english: "nail polish" },
  { chinese: "长指甲", english: "long fingernails" },
  { chinese: "指甲油瓶", english: "nail polish bottle" },
  { chinese: "指甲油刷", english: "nail polish brush" },
  { chinese: "涂指甲油", english: "applying manicure" },
  { chinese: "脚趾甲油", english: "toenail polish" },
  { chinese: "涂脚趾甲", english: "applying pedicure" },
  { chinese: "涂脚趾甲油", english: "painting toenails" },
  { chinese: "剪脚趾甲", english: "clipping toenails" },
  { chinese: "尖脚趾甲", english: "sharp toenails" },
  { chinese: "面部彩绘", english: "facepaint" },
  { chinese: "面部宝石贴", english: "face jewel" },
  { chinese: "化妆品", english: "cosmetics" },
];