/**
 * SVG to PNG 转换脚本
 * 用于将 assets/icons 中的 SVG 图标转换为微信小程序 tabBar 支持的 PNG 格式
 *
 * 使用方法：
 * 1. 安装依赖: pnpm add -D sharp
 * 2. 运行: node scripts/convert-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../src/assets/icons');

// 图标映射配置
const iconMapping = {
  'home': {
    normal: 'solar-home-2-linear.svg',
    active: 'solar-home-2-bold.svg'
  },
  'studio': {
    normal: 'iconoir-network-reverse.svg',
    active: 'iconoir-network-reverse-solid.svg'
  },
  'assets': {
    normal: 'icon-park-outline-activity-source.svg',
    active: 'icon-park-twotone-activity-source.svg'
  },
  'profile': {
    normal: 'material-symbols-person-3-outline-rounded.svg',
    active: 'material-symbols-person-3-rounded.svg'
  }
};

/**
 * 将 SVG 转换为 PNG
 */
async function convertSvgToPng(svgPath, pngPath, size = 81) {
  try {
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(pngPath);
    console.log(`✅ 转换成功: ${path.basename(pngPath)}`);
  } catch (error) {
    console.error(`❌ 转换失败: ${svgPath}`, error.message);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始转换 SVG 图标为 PNG...\n');

  for (const [name, files] of Object.entries(iconMapping)) {
    console.log(`\n处理 ${name} 图标...`);

    // 转换普通状态
    const normalSvg = path.join(iconsDir, files.normal);
    const normalPng = path.join(iconsDir, `${name}.png`);
    if (fs.existsSync(normalSvg)) {
      await convertSvgToPng(normalSvg, normalPng);
    } else {
      console.log(`⚠️  文件不存在: ${files.normal}`);
    }

    // 转换激活状态
    const activeSvg = path.join(iconsDir, files.active);
    const activePng = path.join(iconsDir, `${name}-active.png`);
    if (fs.existsSync(activeSvg)) {
      await convertSvgToPng(activeSvg, activePng);
    } else {
      console.log(`⚠️  文件不存在: ${files.active}`);
    }
  }

  console.log('\n✨ 转换完成！');
}

main().catch(console.error);
