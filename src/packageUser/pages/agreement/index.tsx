import CommonWarp from "@/components/CommonWarp"
import { Cell, Collapse, Divider, Tag } from "@taroify/core"
import { ScrollView, Text, View } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useEffect, useState } from "react"
import "./index.css"

const Agreement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"user" | "privacy">("user")

  // 从 URL 参数获取默认显示的协议类型
  useEffect(() => {
    const router = Taro.getCurrentInstance().router
    const type = router?.params?.type as "user" | "privacy"
    if (type) setActiveTab(type)
  }, [])

  return (
    <CommonWarp title={activeTab === "user" ? "用户协议" : "隐私政策"} withHeader>
      <View className='w-full h-full bg-white flex flex-col'>


        {/* 内容区域 */}
        <ScrollView scrollY className='flex-1'>
          {activeTab === "user" ? <UserAgreement /> : <PrivacyPolicy />}
        </ScrollView>
      </View>
    </CommonWarp>
  )
}

// 用户协议内容组件 - 使用 Taroify 组件优化
const UserAgreement: React.FC = () => {
  return (
    <View className='agreement-content p-4'>
      {/* 标题和基本信息 */}
      <View className='mb-4'>
        <Text className='text-xl font-bold block mb-3'>用户服务协议</Text>
        <View className='flex items-center gap-2 mb-3'>
          <Tag size='medium' color='primary'>更新日期：202X年X月X日</Tag>
          <Tag size='medium' color='success'>生效日期：202X年X月X日</Tag>
        </View>
        <Text className='text-sm text-gray-600 leading-relaxed block'>
          欢迎使用本平台！请在使用前仔细阅读本协议，登录或使用服务即表示您同意接受本协议全部内容。
        </Text>
      </View>

      <Divider />

      {/* 使用 Collapse 折叠面板组织内容 */}
      <Collapse defaultValue={['1']} accordion bordered={false}>
        <Collapse.Item
          value='1'
          title='一、服务内容与账户管理'
          brief='平台服务及账号相关规定'
        >
          <View className='p-3'>
            <Cell.Group inset bordered>
              <Cell
                title='AI 服务内容'
                brief='提供文生图、图生图、图片修复、提示词广场交流等服务。AI生成具有随机性和不确定性'
              />
              <Cell
                title='账号注册'
                brief='通过微信授权登录（OpenID/手机号）；需保证注册信息真实性'
              />
              <Cell
                title='账号安全'
                brief='账号仅限本人使用，禁止赠与、借用、租用、转让或售卖'
              >
                <Tag size='medium' color='danger'>重要</Tag>
              </Cell>
              <Cell
                title='实名认证'
                brief='发布公开内容、充值等特定功能时需完成实名认证'
              />
            </Cell.Group>
          </View>
        </Collapse.Item>

        <Collapse.Item
          value='2'
          title='二、生成式 AI 服务规范'
          brief='AI 内容生成的重要规定'
        >
          <View className='p-3'>
            <Text className='text-sm text-gray-700 leading-relaxed block mb-3'>
              使用本平台生成内容时，必须遵守《生成式人工智能服务管理暂行办法》及相关法律法规，<Text className='text-red-600 font-semibold'>不得生成、传播以下内容</Text>：
            </Text>
            <Cell.Group inset bordered>
              <Cell
                title='禁止内容（1）'
                brief='反对宪法基本原则、危害国家安全、泄露国家秘密、颠覆国家政权'
              />
              <Cell
                title='禁止内容（2）'
                brief='损害国家荣誉和利益、煽动民族仇恨和歧视、破坏民族团结'
              />
              <Cell
                title='禁止内容（3）'
                brief='破坏宗教政策、宣扬邪教和封建迷信、散布谣言和淫秽色情内容'
              />
              <Cell
                title='禁止内容（4）'
                brief='侮辱或诽谤他人、侵害他人名誉、隐私、肖像、知识产权等合法权益'
              />
              <Cell
                title='提示词规范'
                brief='提示词不得包含违禁信息；系统检测到违规词有权拒绝生成并警告'
              >
                <Tag size='medium' color='warning'>自动检测</Tag>
              </Cell>
              <Cell
                title='水印标识'
                brief='平台有权在生成图片中添加显性或隐性水印标识，不得删除或篡改'
              />
            </Cell.Group>
          </View>
        </Collapse.Item>

        <Collapse.Item
          value='3'
          title='三、积分、会员与充值服务'
          brief='虚拟资产及计费规则'
        >
          <View className='p-3'>
            <Cell.Group inset bordered>
              <Cell
                title='虚拟资产'
                brief='积分、算力、会员资格等均为网络虚拟商品'
              />
              <Cell
                title='计费规则'
                brief='生成图片消耗相应积分，具体以页面实时公示为准（受模型、分辨率、步数影响）'
              />
              <Cell
                title='生成失败补偿'
                brief='平台技术原因导致生成失败，自动返还积分；对美学效果不满意或AI固有局限（如畸变）不属于失败'
              >
                <Tag size='medium' color='info'>注意</Tag>
              </Cell>
              <Cell
                title='不退不换'
                brief='充值成功的积分或会员权益，一经售出概不退换，也不能转让或兑换现金（法律另有规定除外）'
              >
                <Tag size='medium' color='danger'>重要</Tag>
              </Cell>
              <Cell
                title='服务终止'
                brief='平台终止运营将提前60日公告，并依法处理虚拟资产'
              />
            </Cell.Group>
          </View>
        </Collapse.Item>

        <Collapse.Item
          value='4'
          title='四、知识产权声明'
          brief='核心权益说明'
        >
          <View className='p-3'>
            <Cell.Group inset bordered>
              <Cell
                title='平台知识产权'
                brief='软件著作权、商标、UI设计、算法逻辑等均归平台所有'
              />
              <Cell
                title='您的权利（UGC）'
                brief='遵守法律及协议前提下，生成图片的权益归您所有，可用于个人欣赏、社交分享或商业用途'
              >
                <Tag size='medium' color='success'>核心权益</Tag>
              </Cell>
              <Cell
                title='平台的权利'
                brief='为提供服务（如历史记录存储），授权我们在服务器上存储生成的图片'
              />
              <Cell
                title='私有模式'
                brief='默认生成的图片为"私有"，仅您自己可见'
              />
              <Cell
                title='公开模式'
                brief='公开发布到广场即视为授予本平台及全体用户全球范围内、免费、永久的许可'
              >
                <Tag size='medium' color='warning'>授权说明</Tag>
              </Cell>
              <Cell
                title='同款制作（Remix）'
                brief='公开图片即代表同意其他用户查看、复制提示词及参数并进行二次创作；不得向使用"做同款"功能的用户主张侵权'
              />
              <Cell
                title='侵权处理'
                brief='发现广场内容侵犯您的权益，请通过客服渠道投诉，我们将依法处理'
              />
            </Cell.Group>
          </View>
        </Collapse.Item>

        <Collapse.Item
          value='5'
          title='五、用户行为准则与违规处理'
          brief='禁止行为及处理措施'
        >
          <View className='p-3'>
            <Text className='text-sm text-gray-700 leading-relaxed block mb-3'>
              <Text className='font-semibold'>禁止行为：</Text>
            </Text>
            <Cell.Group inset bordered className='mb-3'>
              <Cell brief='利用本平台进行洗钱、诈骗等违法活动' />
              <Cell brief='使用外挂、脚本、爬虫等手段恶意刷取积分、攻击服务器' />
              <Cell brief='倒卖平台账号或积分' />
            </Cell.Group>

            <Text className='text-sm text-gray-700 leading-relaxed block mb-3'>
              <Text className='font-semibold'>违规处理措施：</Text>
            </Text>
            <Cell.Group inset bordered>
              <Cell brief='删除违规内容' />
              <Cell brief='限制账号功能（如禁止发布广场、禁止生图）' />
              <Cell brief='冻结或扣除积分/资产' />
              <Cell brief='封禁账号（暂时或永久）' />
              <Cell brief='移交司法机关' />
            </Cell.Group>
          </View>
        </Collapse.Item>

        <Collapse.Item
          value='6'
          title='六、免责声明'
          brief='平台责任范围说明'
        >
          <View className='p-3'>
            <Cell.Group inset bordered>
              <Cell
                title='技术局限性'
                brief='AI技术处于发展阶段，生成内容可能存在逻辑错误、事实性错误或美学瑕疵，平台不承担保证责任'
              />
              <Cell
                title='不可抗力'
                brief='因自然灾害、网络故障、电力故障、黑客攻击、政策法规调整等导致的服务中断或数据丢失，平台不承担责任'
              />
              <Cell
                title='第三方服务'
                brief='如接入第三方模型服务，因第三方原因导致的问题，由第三方承担责任，我们将协助维权'
              />
            </Cell.Group>
          </View>
        </Collapse.Item>

        <Collapse.Item
          value='7'
          title='七、其他'
          brief='协议修改、法律适用及争议解决'
        >
          <View className='p-3'>
            <Cell.Group inset bordered>
              <Cell
                title='协议修改'
                brief='平台有权根据业务发展修改本协议，通过小程序公告等方式通知；不同意修改应停止使用服务'
              />
              <Cell
                title='法律适用'
                brief='本协议的签订、履行及争议解决均适用中华人民共和国法律'
              />
              <Cell
                title='争议解决'
                brief='发生争议应友好协商；协商不成，提交至[公司所在地]人民法院管辖'
              />
            </Cell.Group>
          </View>
        </Collapse.Item>
      </Collapse>
    </View>
  )
}

// 隐私政策内容组件 - 使用 Taroify 组件优化
const PrivacyPolicy: React.FC = () => {
  return (
    <View className='privacy-content p-4'>
      {/* 标题和基本信息 */}
      <View className='mb-4'>
        <Text className='text-xl font-bold block mb-3'>隐私保护指引</Text>
        <View className='flex items-center gap-2 mb-3'>
          <Tag size='medium' color='primary'>更新日期：202X年X月X日</Tag>
          <Tag size='medium' color='success'>生效日期：202X年X月X日</Tag>
        </View>
        <Text className='text-sm text-gray-600 leading-relaxed block'>
          我们深知个人信息对您的重要性，将按照法律法规的规定保护您的个人信息及隐私安全。
        </Text>
      </View>

      <Divider />

      {/* 使用 Collapse 折叠面板组织内容 */}
      <Collapse defaultValue={['1']} accordion bordered={false}>
        <Collapse.Item
          value='1'
          title='一、信息收集与用途'
          brief='我们收集哪些信息及如何使用'
        >
          <View className='p-3'>
            <Text className='text-sm text-gray-700 leading-relaxed block mb-3'>
              为了向您提供服务，我们需要收集以下类型的个人信息。
            </Text>

            <Cell.Group inset bordered>
              <Cell
                title='账号注册与登录'
                brief='收集：微信昵称、头像、OpenID；用途：创建账号、展示个人主页'
              >
                <Tag size='medium' color='danger'>必要</Tag>
              </Cell>
              <Cell
                title='实名认证'
                brief='收集：手机号码；用途：发布广场、评论等功能的身份验证'
              >
                <Tag size='medium' color='warning'>发布功能必要</Tag>
              </Cell>
              <Cell
                title='AI 生图与创作'
                brief='收集：提示词、参考图片、生成记录；用途：提供服务、安全检测、优化模型'
              >
                <Tag size='medium' color='primary'>核心业务</Tag>
              </Cell>
              <Cell
                title='广场社区互动'
                brief='收集：点赞、收藏、评论、发布内容；用途：社交展示、推荐算法'
              />
              <Cell
                title='支付与交易'
                brief='收集：支付金额、订单号、交易时间；用途：处理充值请求'
              />
              <Cell
                title='设备与日志信息'
                brief='收集：IP地址、设备型号、操作系统；用途：安全风控、服务稳定'
              />
            </Cell.Group>
          </View>
        </Collapse.Item>

        <Collapse.Item
          value='2'
          title='二、信息存储'
          brief='数据如何存储及保存期限'
        >
          <View className='p-3'>
            <Cell.Group inset bordered>
              <Cell
                title='存储地点'
                brief='个人信息存储于中华人民共和国境内，不会传输至境外'
              />
              <Cell
                title='存储期限'
                brief='使用期间及账号注销后法定期限内保留；超期将删除或匿名化处理'
              />
              <Cell
                title='图片资产'
                brief='私有图片：未主动删除且账号正常期间保留；临时文件：定期清理'
              />
            </Cell.Group>
          </View>
        </Collapse.Item>

        <Collapse.Item
          value='3'
          title='三、信息共享与第三方服务'
          brief='什么情况下会共享您的信息'
        >
          <View className='p-3'>
            <Text className='text-sm text-gray-700 leading-relaxed block mb-3'>
              我们不会主动共享您的个人信息，但在以下情况除外：
            </Text>
            <Cell.Group inset bordered>
              <Cell
                title='第三方 SDK 服务'
                brief='微信支付 SDK（支付功能）、内容安全服务（违规检测）'
              />
              <Cell
                title='AI 模型服务'
                brief='调用第三方模型 API 时传输提示词，协议约束不得用于其他目的'
              />
              <Cell
                title='法定情形'
                brief='根据法律法规、诉讼争议解决需要，或行政、司法机关要求'
              />
            </Cell.Group>
          </View>
        </Collapse.Item>

        <Collapse.Item
          value='4'
          title='四、您的权利'
          brief='您对个人信息享有的权利'
        >
          <View className='p-3'>
            <Cell.Group inset bordered>
              <Cell
                title='查阅与复制'
                brief='可在"我的"页面查阅昵称、积分、创作历史及收藏记录'
              />
              <Cell
                title='删除'
                brief='可删除"我的作品"中的图片和广场发布的评论'
              />
              <Cell
                title='撤回同意'
                brief='可在微信设置中撤回对用户信息、相册权限等的授权'
              />
              <Cell
                title='账号注销'
                brief='通过【我的 -> 设置 -> 注销账号】申请；注销后数据永久清除无法恢复'
              />
            </Cell.Group>
          </View>
        </Collapse.Item>

        <Collapse.Item
          value='5'
          title='五、未成年人保护'
          brief='未成年人使用说明'
        >
          <View className='p-3'>
            <Cell.Group inset bordered>
              <Cell
                title='年龄限制'
                brief='未满14周岁请在监护人陪同下阅读，征得同意后使用'
              />
              <Cell
                title='充值限制'
                brief='建议未成年人不要使用充值服务'
              />
            </Cell.Group>
          </View>
        </Collapse.Item>

        <Collapse.Item
          value='6'
          title='六、隐私指引的修订'
          brief='条款变更时的处理方式'
        >
          <View className='p-3'>
            <Text className='text-sm text-gray-700 leading-relaxed block'>
              我们可能会适时修订本指引。当条款发生变更时，我们会在版本更新后通过弹窗或公告的形式向您展示，并再次征求您的同意。
            </Text>
          </View>
        </Collapse.Item>

        <Collapse.Item
          value='7'
          title='七、联系我们'
          brief='如有疑问如何联系'
        >
          <View className='p-3'>
            <Cell.Group inset bordered>
              <Cell
                title='在线客服'
                brief='小程序内"我的 -> 联系客服"'
              />
              <Cell
                title='联系邮箱'
                brief='[填写您的邮箱，如 privacy@yourcompany.com]'
              />
              <Cell
                title='注册地址'
                brief='[填写公司注册地址]'
              />
              <Cell
                title='处理时限'
                brief='收到问题后15个工作日内予以受理并处理'
              />
            </Cell.Group>
          </View>
        </Collapse.Item>
      </Collapse>


    </View>
  )
}

export default Agreement
