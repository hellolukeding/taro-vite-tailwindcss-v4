#!/bin/bash

# 微信小程序优化验证脚本

echo "========================================="
echo "微信小程序性能优化验证"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✅${NC} 文件存在: $1"
    return 0
  else
    echo -e "${RED}❌${NC} 文件不存在: $1"
    return 1
  fi
}

check_config() {
  local file=$1
  local pattern=$2
  local desc=$3

  if grep -q "$pattern" "$file"; then
    echo -e "${GREEN}✅${NC} $desc"
    return 0
  else
    echo -e "${RED}❌${NC} $desc"
    return 1
  fi
}

echo "1. 检查关键配置文件..."
echo "-----------------------------------"
check_file "src/app.config.ts"
check_file "config/prod.ts"
check_file "project.config.json"
echo ""

echo "2. 检查组件按需注入配置..."
echo "-----------------------------------"
check_config "src/app.config.ts" "lazyCodeLoading" "lazyCodeLoading 配置"
echo ""

echo "3. 检查生产环境优化配置..."
echo "-----------------------------------"
check_config "config/prod.ts" "optimizeMainPackage" "主包优化"
check_config "config/prod.ts" "minified" "代码压缩"
check_config "config/prod.ts" "debug" "调试模式关闭"
echo ""

echo "4. 检查微信开发者工具配置..."
echo "-----------------------------------"
check_config "project.config.json" '"minified": true' "代码压缩已启用"
check_config "project.config.json" '"uglifyFileName": true' "文件名混淆已启用"
check_config "project.config.json" '"uploadWithSourceMap": false' "源码保护已启用"
echo ""

echo "5. 检查构建产物..."
echo "-----------------------------------"
if [ -d "dist" ]; then
  echo -e "${GREEN}✅${NC} 构建目录存在"

  # 检查主包大小
  if command -v du &> /dev/null; then
    SIZE=$(du -sh dist | cut -f1)
    echo "📦 主包大小: $SIZE"

    # 检查 app.config.js
    if [ -f "dist/app.config.js" ]; then
      if grep -q "lazyCodeLoading" "dist/app.config.js"; then
        echo -e "${GREEN}✅${NC} 构建产物包含 lazyCodeLoading 配置"
      else
        echo -e "${RED}❌${NC} 构建产物缺少 lazyCodeLoading 配置"
      fi
    fi
  fi
else
  echo -e "${YELLOW}⚠️${NC} 构建目录不存在，请先运行: npm run build:weapp"
fi
echo ""

echo "6. 检查依赖..."
echo "-----------------------------------"
if [ -f "package.json" ]; then
  if grep -q "@tarojs/taro" "package.json"; then
    VERSION=$(grep "@tarojs/taro" package.json | head -1)
    echo "📦 Taro 版本: $VERSION"
  fi

  # 检查基础库版本
  if [ -f "project.config.json" ]; then
    LIB_VERSION=$(grep "libVersion" project.config.json | cut -d'"' -f4)
    echo "📱 微信基础库: $LIB_VERSION"

    # 检查是否支持 lazyCodeLoading
    if [ "$LIB_VERSION" != "3.11.0" ]; then
      echo -e "${YELLOW}⚠️${NC} 基础库版本建议使用 3.11.0 或更高"
    else
      echo -e "${GREEN}✅${NC} 基础库版本支持组件按需注入"
    fi
  fi
fi
echo ""

echo "7. 下一步操作..."
echo "-----------------------------------"
echo -e "${YELLOW}📝${NC} 如果所有检查都通过："
echo "   1. 清理缓存: rm -rf dist && rm -rf node_modules/.cache"
echo "   2. 重新构建: npm run build:weapp"
echo "   3. 打开微信开发者工具，导入 dist 目录"
echo "   4. 点击'上传'，验证不再提示'组件未按需注入'"
echo ""
echo -e "${RED}⚠️${NC} 如果有检查失败："
echo "   1. 检查对应的配置文件是否正确"
echo "   2. 查看本文档的'故障排查'部分"
echo "   3. 参考官方文档: https://developers.weixin.qq.com/miniprogram/dev/framework/performance/"
echo ""

echo "========================================="
echo "验证完成！"
echo "========================================="
