<template>
  <div>
    <!-- 登陆和注册 -->
    <div v-if="$common.isEmpty(currentUser) && $common.isEmpty($store.state.currentAdmin)"
         class="myCenter login-register-container my-animation-hideToShow">
      <!-- 背景图片 -->
      <el-image class="my-el-image"
                style="position: absolute"
                v-once
                lazy
                :src="$store.state.webInfo.randomCover[Math.floor(Math.random() * $store.state.webInfo.randomCover.length)]"
                fit="cover">
        <div slot="error" class="image-slot"></div>
      </el-image>

      <div class="auth-container">
        <!-- 图片框 -->
        <div class="auth-image-card">
          <div class="auth-image-content"></div>
        </div>

        <!-- 登录/注册卡片 -->
        <div class="auth-card-wrapper">
          <!-- 登录卡片 -->
          <el-card v-if="!isRegisterMode" class="auth-card">
            <div slot="header" class="clearfix auth-header">
              <span class="auth-title">登 录</span>
            </div>
            <el-form ref="loginForm" :model="loginForm" label-width="0px" @keyup.enter="login()">
              <el-form-item>
                <el-radio-group v-model="loginForm.isAdmin" class="login-type-selector">
                  <el-radio :label="false">普通用户</el-radio>
                  <el-radio :label="true">管理员</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="loginForm.account"
                  placeholder="用户名/邮箱/手机号"
                  clearable
                  prefix-icon="mdi:user">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="密码"
                  clearable
                  prefix-icon="mdi:lock"
                  show-password>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="login()" class="auth-button">{{ loginForm.isAdmin ? '管理员登录' : '登录' }}</el-button>
              </el-form-item>
              <el-form-item class="agreement-item">
                <el-checkbox v-model="loginAgreed">
                  我已阅读并同意本站的
                  <el-link type="primary" @click.stop="showAboutModal = true">用户协议</el-link>
                  和
                  <el-link type="primary" @click.stop="showPrivacyModal = true">隐私政策</el-link>
                </el-checkbox>
              </el-form-item>
              <div class="auth-footer">
                <el-link type="primary" @click="changeDialog('找回密码')">忘记密码？</el-link>
                <el-divider direction="vertical"></el-divider>
                <el-link type="primary" @click="isRegisterMode = true">立即注册</el-link>
              </div>
            </el-form>
          </el-card>

          <!-- 注册卡片 -->
          <el-card v-else class="auth-card">
            <div slot="header" class="clearfix auth-header">
              <span class="auth-title">注 册</span>
            </div>
            <el-form ref="registerForm" :model="registerForm" label-width="0px" @keyup.enter="regist()">
              <el-form-item>
                <el-input
                  v-model="registerForm.username"
                  maxlength="30"
                  placeholder="用户名"
                  clearable
                  prefix-icon="mdi:user">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="registerForm.password"
                  type="password"
                  maxlength="30"
                  placeholder="密码"
                  clearable
                  prefix-icon="mdi:lock"
                  show-password>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="registerForm.email"
                  type="email"
                  placeholder="邮箱"
                  clearable
                  prefix-icon="mdi:message">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="registerForm.code"
                  placeholder="验证码"
                  disabled
                  prefix-icon="mdi:key"
                  class="code-input">
                  <el-button
                    slot="append"
                    @click="changeDialog('邮箱验证码')"
                    type="primary"
                    class="code-button">
                    获取验证码
                  </el-button>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="regist()" class="auth-button">注册</el-button>
              </el-form-item>
              <el-form-item class="agreement-item">
                <el-checkbox v-model="registerAgreed">
                  我已阅读并同意
                  <el-link type="primary" @click.stop="showAboutModal = true">用户协议</el-link>
                  和
                  <el-link type="primary" @click.stop="showPrivacyModal = true">隐私政策</el-link>
                </el-checkbox>
              </el-form-item>
              <div class="auth-footer">
                <el-link type="primary" @click="isRegisterMode = false">已有账号，登录</el-link>
              </div>
            </el-form>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 关于弹窗 -->
    <div v-if="showAboutModal" class="modal-overlay" @click="showAboutModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>📬用户协议</h2>
          <button class="modal-close" @click="showAboutModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <h3>用户协议</h3>
          <p><i>CZP</i>（以下简称"我们"）依据本协议为用户（以下简称"你"）提供<i>czpv.top</i>服务。本协议对你和我们均具有法律约束力。</p>
          <h4>一、本服务的功能</h4>
          <p>你可以使用本服务获取本站生活，AI科技相关的信息。</p>
          <h4>二、责任范围及限制</h4>
          <p>你使用本服务得到的结果仅供参考，实际情况以官方为准。</p>
          <h4>三、隐私保护</h4>
          <p>我们重视对你隐私的保护，你的个人隐私信息将根据《隐私政策》受到保护与规范，详情请参阅《隐私政策》。</p>
          <h4>四、其他条款</h4>
          <p>4.1 本协议所有条款的标题仅为阅读方便，本身并无实际涵义，不能作为本协议涵义解释的依据。</p>
          <p>4.2 本协议条款无论因何种原因部分无效或不可执行，其余条款仍有效，对双方具有约束力。</p>
        </div>
      </div>
    </div>

    <!-- 隐私政策弹窗 -->
    <div v-if="showPrivacyModal" class="modal-overlay" @click="showPrivacyModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>🔒隐私政策</h2>
          <button class="modal-close" @click="showPrivacyModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div>更新日期：<strong>2026/1/23</strong></div>
                <div>生效日期：<strong>2026/1/23</strong></div>
                <h2>导言</h2>
                <p>
                  <i>czpv.top</i> 是一款由 <i>CZP</i> （以下简称“我们”）提供的产品。
                  您在使用我们的服务时，我们可能会收集和使用您的相关信息。我们希望通过本《隐私政策》向您说明，在使用我们的服务时，我们如何收集、使用、储存和分享这些信息，以及我们为您提供的访问、更新、控制和保护这些信息的方式。
                  本《隐私政策》与您所使用的 <i>czpv.top</i> 服务息息相关，希望您仔细阅读，在需要时，按照本《隐私政策》的指引，作出您认为适当的选择。本《隐私政策》中涉及的相关技术词汇，我们尽量以简明扼要的表述，并提供进一步说明的链接，以便您的理解。
                </p>
                <p><strong>您使用或继续使用我们的服务，即意味着同意我们按照本《隐私政策》收集、使用、储存和分享您的相关信息。</strong></p>
                <p>如对本《隐私政策》或相关事宜有任何问题，请通过 <strong>czp9919@outlook.com</strong> 与我们联系。</p>

                <h2>1. 我们收集的信息</h2>
                <p>我们或我们的第三方合作伙伴提供服务时，可能会收集、储存和使用下列与您有关的信息。如果您不提供相关信息，可能无法注册成为我们的用户或无法享受我们提供的某些服务，或者无法达到相关服务拟达到的效果。</p>

                <ul>
                    <li><strong>个人信息</strong>，您在注册账户或使用我们的服务时，向我们提供的相关个人信息，例如电话号码、电子邮件等。</li>
                <li><strong>位置信息</strong>，指您开启设备定位功能并使用我们基于位置提供的相关服务时，获取的有关您位置的信息，包括：<ul><li>您通过具有定位功能的移动设备使用我们的服务时，通过GPS或WiFi等方式获取的您的地理位置信息，目前主要运用于<strong>获取用户当前当地日落日起时间；</strong></li><li>您可以通过关闭定位功能，停止对您的地理位置信息的收集。</li></ul></li>
                <li><strong>日志信息</strong>，指您使用我们的服务时，系统可能通过cookies、标识符及相关技术收集的信息，包括您的<strong>设备信息</strong>、<strong>浏览信息</strong>、<strong>点击信息</strong>，并将该等信息储存为日志信息，为您提供个性化的用户体验、保障服务安全。您可以通过浏览器设置拒绝或管理cookie、标识符或相关技术的使用。</li>
                </ul>

                <h2>2. 信息的存储</h2>
                <strong>2.1 信息存储的方式和期限</strong>
                <ul>
                <li>我们会通过安全的方式存储您的信息，包括本地存储（例如利用APP进行数据缓存）、数据库和服务器日志。</li>
                <li>一般情况下，我们只会在为实现服务目的所必需的时间内或法律法规规定的条件下存储您的个人信息。</li>
                </ul>

                <strong>2.2 信息存储的地域</strong>
                <ul>
                <li>我们会按照法律法规规定，将境内收集的用户个人信息存储于中国境内。</li>
                <li>目前我们不会跨境传输或存储您的个人信息。将来如需跨境传输或存储的，我们会向您告知信息出境的目的、接收方、安全保证措施和安全风险，并征得您的同意。</li>
                </ul>

                <strong>2.3 产品或服务停止运营时的通知</strong>
                <ul>
                <li>当我们的产品或服务发生停止运营的情况时，我们将以推送通知、公告等形式通知您，并在合理期限内删除您的个人信息或进行匿名化处理，法律法规另有规定的除外。</li>
                </ul>

                <h2>3. 信息安全</h2>
                <p>
                我们使用各种安全技术和程序，以防信息的丢失、不当使用、未经授权阅览或披露。例如，在某些服务中，我们将利用加密技术（例如SSL）来保护您提供的个人信息。但请您理解，由于技术的限制以及可能存在的各种恶意手段，在互联网行业，即便竭尽所能加强安全措施，也不可能始终保证信息百分之百的安全。您需要了解，您接入我们的服务所用的系统和通讯网络，有可能因我们可控范围外的因素而出现问题。
                </p>

                <h2>4. 我们如何使用信息</h2>
                <p>我们可能将在向您提供服务的过程之中所收集的信息用作下列用途：</p>
                <ul>
                  <li>向您提供服务；</li>
                  <li>在我们提供服务时，用于身份验证、客户服务、安全防范、诈骗监测、存档和备份用途，确保我们向您提供的产品和服务的安全性；</li>
                  <li>帮助我们设计新服务，改善我们现有服务；</li>
                  <li>使我们更加了解您如何接入和使用我们的服务，从而针对性地回应您的个性化需求，例如语言设定、位置设定、个性化的帮助服务和指示，或对您和其他用户作出其他方面的回应；</li>
                  <li>向您提供与您更加相关的广告以替代普遍投放的广告；</li>
                  <li>评估我们服务中的广告和其他促销及推广活动的效果，并加以改善；</li>
                  <li>软件认证或管理软件升级；</li>
                  <li>让您参与有关我们产品和服务的调查。</li>
                </ul>

                <h2>5. 信息共享</h2>
                <p>
                目前，我们不会主动共享或转让您的个人信息至第三方，如存在其他共享或转让您的个人信息或您需要我们将您的个人信息共享或转让至第三方情形时，我们会直接或确认第三方征得您对上述行为的明示同意。
                </p>
                <p>
                为了投放广告，评估、优化广告投放效果等目的，我们需要向广告主及其代理商等第三方合作伙伴共享您的部分数据，要求其严格遵守我们关于数据隐私保护的措施与要求，包括但不限于根据数据保护协议、承诺书及相关数据处理政策进行处理，避免识别出个人身份，保障隐私安全。
                </p>
                <p>
                我们不会向合作伙伴分享可用于识别您个人身份的信息（例如您的姓名或电子邮件地址），除非您明确授权。
                </p>
                <p>
                我们不会对外公开披露所收集的个人信息，如必须公开披露时，我们会向您告知此次公开披露的目的、披露信息的类型及可能涉及的敏感信息，并征得您的明示同意。
                </p>
                <p>
                随着我们业务的持续发展，我们有可能进行合并、收购、资产转让等交易，我们将告知您相关情形，按照法律法规及不低于本《隐私政策》所要求的标准继续保护或要求新的控制者继续保护您的个人信息。
                </p>
                <p>
                另外，根据相关法律法规及国家标准，以下情形中，我们可能会共享、转让、公开披露个人信息无需事先征得您的授权同意：
                </p>
                <ul>
                  <li>与国家安全、国防安全直接相关的；</li>
                  <li>与公共安全、公共卫生、重大公共利益直接相关的；</li>
                  <li>犯罪侦查、起诉、审判和判决执行等直接相关的；</li>
                  <li>出于维护个人信息主体或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；</li>
                  <li>个人信息主体自行向社会公众公开个人信息的；</li>
                  <li>从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道。</li>
                </ul>

                <h2>6. 您的权利</h2>
                <p>
                在您使用我们的服务期间，我们可能会视产品具体情况为您提供相应的操作设置，以便您可以查询、删除、更正或撤回您的相关个人信息，您可参考相应的具体指引进行操作。此外，我们还设置了投诉举报渠道，您的意见将会得到及时的处理。如果您无法通过上述途径和方式行使您的个人信息主体权利，您可以通过本《隐私政策》中提供的联系方式提出您的请求，我们会按照法律法规的规定予以反馈。
                </p>
                <p>当您决定不再使用我们的产品或服务时，可以申请注销账户。注销账户后，除法律法规另有规定外，我们将删除或匿名化处理您的个人信息。</p>

                <h2>7. 变更</h2>
                <p>
                我们可能适时修订本《隐私政策》的条款。当变更发生时，我们会在版本更新时向您提示新的《隐私政策》，并向您说明生效日期。请您仔细阅读变更后的《隐私政策》内容，<strong>若您继续使用我们的服务，即表示您同意我们按照更新后的《隐私政策》处理您的个人信息。</strong>
                </p>

                <h2>8. 未成年人保护</h2>
                <p>
                我们鼓励父母或监护人指导未满十八岁的未成年人使用我们的服务。我们建议未成年人鼓励他们的父母或监护人阅读本《隐私政策》，并建议未成年人在提交的个人信息之前寻求父母或监护人的同意和指导。
                </p>
        </div>
      </div>
    </div>

    <!-- 用户信息 -->
    <div v-if="!$common.isEmpty(currentUser) || !$common.isEmpty($store.state.currentAdmin)" class="user-container myCenter my-animation-hideToShow">
      <!-- 背景图片 -->
      <el-image class="my-el-image"
                style="position: absolute"
                v-once
                lazy
                :src="$store.state.webInfo.randomCover[Math.floor(Math.random() * $store.state.webInfo.randomCover.length)]"
                fit="cover">
        <div slot="error" class="image-slot"></div>
      </el-image>

      <el-card class="user-info-card">
        <div slot="header" class="clearfix user-header">
          <div class="title-group">
            <div class="title-row">
              <span class="title-text">个人信息</span>
              <span class="role-badge" :class="{ admin: isAdmin }">
                {{ isAdmin ? '管理员' : '普通用户' }}
              </span>
            </div>
            <div class="title-sub">管理资料与安全设置</div>
          </div>
        </div>

        <div class="user-info-wrapper">
          <div class="user-info-grid">
            <!-- 头像和用户名 -->
            <div class="profile-pane">
              <div class="profile-card">
                <div class="user-profile-section">
                  <el-avatar
                    class="user-avatar"
                    :size="100"
                    :src="loggedInUser.avatar"
                    @click="changeDialog('修改头像')"
                    style="cursor: pointer;">
                    <iconify-icon icon="mdi:image"></iconify-icon>
                  </el-avatar>
                  <div class="profile-info">
                    <div class="username-row">
                      <span class="username">{{ loggedInUser.username }}</span>
                      <el-button
                        type="text"
                        class="edit-btn"
                        @click="changeDialog('修改头像')">
                        修改头像
                      </el-button>
                    </div>
                    <div class="join-time">加入于 {{ getJoinDate() }}</div>
                  </div>
                </div>
                <div class="profile-meta">
                  <div class="meta-item">
                    <iconify-icon icon="mdi:calendar"></iconify-icon>
                    资料完善度越高，推荐越精准
                  </div>
                </div>
              </div>
            </div>

            <!-- 用户信息表单 -->
            <div class="form-pane">
              <el-form
                ref="userForm"
                :model="loggedInUser"
                label-width="0"
                class="user-form">

                <el-form-item label="邮箱" class="form-item-no-label">
                  <div v-if="!$common.isEmpty(loggedInUser.email)" class="info-row">
                    <span class="info-label">邮箱：</span>
                    <span class="info-value">{{ loggedInUser.email }}</span>
                    <el-button
                      type="text"
                      class="edit-btn"
                      @click="changeDialog('修改邮箱')">
                      修改
                    </el-button>
                  </div>
                  <el-button
                    v-else
                    type="text"
                    class="edit-btn"
                    @click="changeDialog('绑定邮箱')">
                    + 绑定邮箱
                  </el-button>
                </el-form-item>

                <el-form-item label="手机号" class="form-item-no-label">
                  <div v-if="!$common.isEmpty(loggedInUser.phoneNumber)" class="info-row">
                    <span class="info-label">手机号：</span>
                    <span class="info-value">{{ loggedInUser.phoneNumber }}</span>
                    <el-button
                      type="text"
                      class="edit-btn"
                      disabled>
                      修改（未接入）
                    </el-button>
                  </div>
                  <el-button
                    v-else
                    type="text"
                    class="edit-btn"
                    disabled>
                    + 绑定手机号（未接入）
                  </el-button>
                </el-form-item>

                <el-form-item label="性别" class="form-item-no-label">
                  <div class="info-row">
                    <span class="info-label">性别：</span>
                    <el-radio-group v-model="loggedInUser.gender" class="gender-group">
                      <el-radio :label="0">未定</el-radio>
                      <el-radio :label="1">男</el-radio>
                      <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                  </div>
                </el-form-item>

                <el-form-item label="简介" class="form-item-no-label">
                  <div class="intro-section">
                    <div class="intro-label">简介</div>
                    <el-input
                      v-model="loggedInUser.introduction"
                      maxlength="100"
                      type="textarea"
                      placeholder="添加个人简介..."
                      class="intro-input">
                    </el-input>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <!-- 底部按钮区域 -->
          <div class="user-actions">
            <el-button
              type="primary"
              @click="submitUserInfo()"
              class="save-btn">
              保存修改
            </el-button>
            <div class="action-buttons">
              <el-button
                v-if="isAdmin"
                type="text"
                @click="$router.push('/admin')"
                icon="mdi:setting"
                class="action-btn">
                进入管理后台
              </el-button>
              <el-button
                type="text"
                @click="logout()"
                class="action-btn logout-btn">
                退出登录
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>


    <!-- 对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      width="30%"
      :before-close="clearDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      center>

      <!-- 修改/绑定手机号 -->
      <el-form v-if="dialogTitle === '修改手机号' || dialogTitle === '绑定手机号'">
        <el-form-item label="手机号" label-width="80px">
          <el-input v-model="phoneNumber" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="验证码" label-width="80px">
          <el-input v-model="code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="80px">
          <el-input v-model="password" type="password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
      </el-form>

      <!-- 修改/绑定邮箱 -->
      <el-form v-else-if="dialogTitle === '修改邮箱' || dialogTitle === '绑定邮箱'">
        <el-form-item label="邮箱" label-width="80px">
          <el-input v-model="email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="验证码" label-width="80px">
          <el-input v-model="code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="80px">
          <el-input v-model="password" type="password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
      </el-form>

      <!-- 修改头像 -->
      <div v-else-if="dialogTitle === '修改头像'">
        <uploadPicture :isAdmin="isAdmin" :prefix="'userAvatar'" @addPicture="addPicture" :maxSize="1" :maxNumber="1"></uploadPicture>
      </div>

      <!-- 找回密码 -->
      <div v-else-if="dialogTitle === '找回密码'">
        <el-form label-width="80px">
          <el-form-item label="方式">
            <el-radio-group v-model="passwordFlag">
              <el-radio :label="1">手机号</el-radio>
              <el-radio :label="2">邮箱</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="passwordFlag === 1" label="手机号" label-width="80px">
            <el-input v-model="phoneNumber" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item v-if="passwordFlag === 1" label="验证码" label-width="80px">
            <el-input v-model="code" placeholder="请输入验证码"></el-input>
          </el-form-item>
          <el-form-item v-if="passwordFlag === 2" label="邮箱" label-width="80px">
            <el-input v-model="email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item v-if="passwordFlag === 2" label="验证码" label-width="80px">
            <el-input v-model="code" placeholder="请输入验证码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" label-width="80px" v-if="passwordFlag">
            <el-input v-model="password" type="password" placeholder="请输入新密码" show-password></el-input>
          </el-form-item>
        </el-form>
      </div>

      <!-- 邮箱验证码 -->
      <el-form v-else-if="dialogTitle === '邮箱验证码'">
        <el-form-item label="邮箱" label-width="80px">
          <el-input v-model="email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="验证码" label-width="80px">
          <el-input v-model="code" placeholder="请输入验证码"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="dialogTitle !== '修改头像'"
          @click="getCode()"
          type="primary"
          v-show="['修改手机号', '绑定手机号', '修改邮箱', '绑定邮箱', '找回密码', '邮箱验证码'].includes(dialogTitle)">
          {{ codeString }}
        </el-button>
        <el-button @click="clearDialog">取消</el-button>
        <el-button type="primary" @click="submitDialog()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  const uploadPicture = () => import( "./common/uploadPicture");

  export default {
    components: {
      uploadPicture
    },
    data() {
      return {
        currentUser: this.$store.state.currentUser,
        currentAdmin: this.$store.state.currentAdmin,
        isRegisterMode: false,
        loginForm: {
          account: "",
          password: "",
          isAdmin: false
        },
        registerForm: {
          username: "",
          password: "",
          email: "",
          code: ""
        },
        phoneNumber: "",
        email: "",
        password: "",
        avatar: "",
        code: "",
        showDialog: false,
        dialogTitle: "",
        codeString: "获取验证码",
        passwordFlag: null,
        intervalCode: null,
        loginAgreed: false,
        registerAgreed: false,
        showAboutModal: false,
        showPrivacyModal: false
      }
    },
    computed: {
      // 获取当前登录用户（普通用户或管理员）
      loggedInUser() {
        return !this.$common.isEmpty(this.currentUser) ? this.currentUser : this.currentAdmin;
      },
      // 判断是否为管理员
      isAdmin() {
        return !this.$common.isEmpty(this.currentAdmin);
      }
    },
    created() {
      // 监听store变化，保持data同步
      this.$watch(() => this.$store.state.currentUser, (newVal) => {
        this.currentUser = newVal;
      });
      this.$watch(() => this.$store.state.currentAdmin, (newVal) => {
        this.currentAdmin = newVal;
      });
    },
    methods: {
      getJoinDate() {
        const user = this.loggedInUser;
        if (user && user.createTime) {
          return user.createTime.split(' ')[0];
        }
        return "未知";
      },
      logout() {
        this.$confirm('确认退出登录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // 清除普通用户和管理员信息s
          this.$store.commit("loadCurrentUser", {});
          this.$store.commit("loadCurrentAdmin", {});
          localStorage.removeItem("userToken");
          localStorage.removeItem("adminToken");
          this.$router.push({path: '/'});
          this.$message({
            message: "已退出登录",
            type: "success"
          });
        }).catch(() => {});
      },
      addPicture(res) {
        const avatarUrl = typeof res === "string" ? res.trim() : ((res && res.url) ? String(res.url).trim() : "");
        if (this.$common.isEmpty(avatarUrl)) {
          this.$message({
            message: "上传成功但头像地址为空，请重试",
            type: "error"
          });
          return;
        }
        this.avatar = avatarUrl;
        this.submitDialog();
      },
      login() {
        if (this.$common.isEmpty(this.loginForm.account) || this.$common.isEmpty(this.loginForm.password)) {
          this.$message({
            message: "请输入账号或密码！",
            type: "error"
          });
          return;
        }

        if (!this.loginAgreed) {
          this.$message({
            message: "请勾选协议以继续登录！",
            type: "warning"
          });
          return;
        }

        let user = {
          account: this.loginForm.account.trim(),
          password: this.$common.encrypt(this.loginForm.password.trim()),
          isAdmin: this.loginForm.isAdmin
        };

        this.$http.post(this.$constant.baseURL + "/user/login", user, this.loginForm.isAdmin, false)
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              // 根据登录类型存储不同的token和user信息
              if (this.loginForm.isAdmin) {
                // 管理员登录
                this.$store.commit("loadCurrentAdmin", res.data);
                localStorage.setItem("adminToken", res.data.accessToken);
                this.$router.push({path: '/admin'});
              } else {
                // 普通用户登录
                this.$store.commit("loadCurrentUser", res.data);
                localStorage.setItem("userToken", res.data.accessToken);
                this.$router.push({path: '/'});
              }
              this.loginForm = { account: "", password: "", isAdmin: false };
              this.$message({
                message: this.loginForm.isAdmin ? "管理员登录成功" : "登录成功",
                type: "success"
              });
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      regist() {
        if (this.$common.isEmpty(this.registerForm.username) || this.$common.isEmpty(this.registerForm.password)) {
          this.$message({
            message: "请输入用户名或密码！",
            type: "error"
          });
          return;
        }

        if (this.$common.isEmpty(this.registerForm.email)) {
          this.$message({
            message: "请输入邮箱！",
            type: "error"
          });
          return false;
        }

        if (this.$common.isEmpty(this.registerForm.code)) {
          this.$message({
            message: "请输入验证码！",
            type: "error"
          });
          return;
        }

        if (this.registerForm.username.indexOf(" ") !== -1 || this.registerForm.password.indexOf(" ") !== -1) {
          this.$message({
            message: "用户名或密码不能包含空格！",
            type: "error"
          });
          return;
        }

        if (!this.registerAgreed) {
          this.$message({
            message: "请勾选协议以继续注册！",
            type: "warning"
          });
          return;
        }

        let user = {
          username: this.registerForm.username.trim(),
          code: this.registerForm.code.trim(),
          password: this.$common.encrypt(this.registerForm.password.trim()),
          email: this.registerForm.email
        };

        this.$http.post(this.$constant.baseURL + "/user/regist", user)
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.$store.commit("loadCurrentUser", res.data);
              localStorage.setItem("userToken", res.data.accessToken);
              this.registerForm = { username: "", password: "", email: "", code: "" };
              this.$router.push({path: '/'});
              let userToken = this.$common.encrypt(localStorage.getItem("userToken"));
              window.open(this.$constant.imBaseURL + "?userToken=" + userToken);
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      submitUserInfo() {
        if (!this.checkParameters()) {
          return;
        }

        let user = {
          username: this.loggedInUser.username,
          gender: this.loggedInUser.gender
        };

        if (!this.$common.isEmpty(this.loggedInUser.introduction)) {
          user.introduction = this.loggedInUser.introduction.trim();
        }

        this.$confirm('确认保存？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success',
          center: true
        }).then(() => {
          this.$http.post(this.$constant.baseURL + "/user/updateUserInfo", user)
            .then((res) => {
              if (!this.$common.isEmpty(res.data)) {
                this.$store.commit("loadCurrentUser", res.data);
                this.currentUser = this.$store.state.currentUser;
                this.currentAdmin = this.$store.state.currentAdmin;
                this.$message({
                  message: "修改成功！",
                  type: "success"
                });
              }
            })
            .catch((error) => {
              this.$message({
                message: error.message,
                type: "error"
              });
            });
        }).catch(() => {});
      },
      checkParams(params) {
        if (this.dialogTitle === "修改手机号" || this.dialogTitle === "绑定手机号" || (this.dialogTitle === "找回密码" && this.passwordFlag === 1)) {
          params.flag = 1;
          if (this.$common.isEmpty(this.phoneNumber)) {
            this.$message({
              message: "请输入手机号！",
              type: "error"
            });
            return false;
          }
          if (!(/^1[345789]\d{9}$/.test(this.phoneNumber))) {
            this.$message({
              message: "手机号格式有误！",
              type: "error"
            });
            return false;
          }
          params.place = this.phoneNumber;
          return true;
        } else if (this.dialogTitle === "修改邮箱" || this.dialogTitle === "绑定邮箱" || this.dialogTitle === "邮箱验证码" || (this.dialogTitle === "找回密码" && this.passwordFlag === 2)) {
          params.flag = 2;
          if (this.$common.isEmpty(this.email)) {
            this.$message({
              message: "请输入邮箱！",
              type: "error"
            });
            return false;
          }
          if (!(/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/.test(this.email))) {
            this.$message({
              message: "邮箱格式有误！",
              type: "error"
            });
            return false;
          }
          params.place = this.email;
          return true;
        }
        return false;
      },
      checkParameters() {
        if (this.$common.isEmpty(this.loggedInUser.username)) {
          this.$message({
            message: "请输入用户名！",
            type: "error"
          });
          return false;
        }

        if (this.loggedInUser.username.indexOf(" ") !== -1) {
          this.$message({
            message: "用户名不能包含空格！",
            type: "error"
          });
          return false;
        }
        return true;
      },
      changeDialog(value) {
        if (value === "邮箱验证码") {
          if (this.$common.isEmpty(this.registerForm.email)) {
            this.$message({
              message: "请输入邮箱！",
              type: "error"
            });
            return false;
          }
          if (!(/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/.test(this.registerForm.email))) {
            this.$message({
              message: "邮箱格式有误！",
              type: "error"
            });
            return false;
          }
          this.email = this.registerForm.email;
        }

        this.dialogTitle = value;
        this.showDialog = true;
      },
      submitDialog() {
        if (this.dialogTitle === "修改头像") {
          const oldAvatar = this.loggedInUser && this.loggedInUser.avatar;
          const newAvatar = typeof this.avatar === "string" ? this.avatar.trim() : "";
          if (this.$common.isEmpty(oldAvatar) && this.$common.isEmpty(newAvatar)) {
            this.$message({
              message: "请上传头像！",
              type: "error"
            });
          } else {
            const user = {
              avatar: newAvatar || oldAvatar
            };
            this.$http.post(this.$constant.baseURL + "/user/updateUserInfo", user, this.isAdmin)
              .then((res) => {
                if (!this.$common.isEmpty(res.data)) {
                  this.$store.commit("loadCurrentUser", res.data);
                  this.currentUser = this.$store.state.currentUser;
                  this.currentAdmin = this.$store.state.currentAdmin;
                  this.clearDialog();
                  this.$message({
                    message: "修改成功！",
                    type: "success"
                  });
                }
              })
              .catch((error) => {
                this.$message({
                  message: error.message,
                  type: "error"
                });
              });
          }
        } else if (this.dialogTitle === "修改手机号" || this.dialogTitle === "绑定手机号" || this.dialogTitle === "修改邮箱" || this.dialogTitle === "绑定邮箱") {
          this.updateSecretInfo();
        } else if (this.dialogTitle === "找回密码") {
          if (this.passwordFlag !== 1 && this.passwordFlag !== 2) {
            this.$message({
              message: "请选择找回方式！",
              type: "error"
            });
          } else {
            this.updateSecretInfo();
          }
        } else if (this.dialogTitle === "邮箱验证码") {
          this.registerForm.code = this.code;
          this.showDialog = false;
        }
      },
      updateSecretInfo() {
        if (this.$common.isEmpty(this.code)) {
          this.$message({
            message: "请输入验证码！",
            type: "error"
          });
          return;
        }
        if (this.$common.isEmpty(this.password)) {
          this.$message({
            message: "请输入密码！",
            type: "error"
          });
          return;
        }
        let params = {
          code: this.code.trim(),
          password: this.$common.encrypt(this.password.trim())
        };
        if (!this.checkParams(params)) {
          return;
        }

        if (this.dialogTitle === "找回密码") {
          this.$http.post(this.$constant.baseURL + "/user/updateForForgetPassword", params, false, false)
            .then((res) => {
              this.clearDialog();
              this.$message({
                message: "修改成功，请重新登陆！",
                type: "success"
              });
            })
            .catch((error) => {
              this.$message({
                message: error.message,
                type: "error"
              });
            });
        } else {
          this.$http.post(this.$constant.baseURL + "/user/updateSecretInfo", params, false, false)
            .then((res) => {
              if (!this.$common.isEmpty(res.data)) {
                this.$store.commit("loadCurrentUser", res.data);
                this.currentUser = this.$store.state.currentUser;
                this.currentAdmin = this.$store.state.currentAdmin;
                this.clearDialog();
                this.$message({
                  message: "修改成功！",
                  type: "success"
                });
              }
            })
            .catch((error) => {
              this.$message({
                message: error.message,
                type: "error"
              });
            });
        }
      },
      getCode() {
        if (this.codeString === "获取验证码") {
          let params = {};
          if (!this.checkParams(params)) {
            return;
          }

          let url;
          if (this.dialogTitle === "找回密码" || this.dialogTitle === "邮箱验证码") {
            url = "/user/getCodeForForgetPassword";
          } else {
            url = "/user/getCodeForBind";
          }

          this.$http.get(this.$constant.baseURL + url, params)
            .then((res) => {
              this.$message({
                message: "验证码已发送，请注意查收！",
                type: "success"
              });
            })
            .catch((error) => {
              this.$message({
                message: error.message,
                type: "error"
              });
            });
          this.codeString = "30秒";
          this.intervalCode = setInterval(() => {
            if (this.codeString === "0秒") {
              clearInterval(this.intervalCode)
              this.codeString = "获取验证码";
            } else {
              let num = parseInt(this.codeString) - 1;
              this.codeString = num + "秒";
            }
          }, 1000);
        } else {
          this.$message({
            message: "请稍后再试！",
            type: "warning"
          });
        }
      },
      clearDialog() {
        this.password = "";
        this.phoneNumber = "";
        this.email = "";
        this.avatar = "";
        this.showDialog = false;
        this.code = "";
        this.dialogTitle = "";
        this.passwordFlag = null;
        this.codeString = "获取验证码";
        if (this.intervalCode) {
          clearInterval(this.intervalCode);
        }
      }
    }
  }
</script>

<style scoped>
  /* 通用样式 */
  .login-register-container,
  .user-container {
    width: 100vw;
    height: 100vh;
    position: relative;
  }

  /* ========== 登录/注册样式 ========== */
  .auth-container {
    display: flex;
    gap: 0;
    align-items: stretch;
    justify-content: center;
    position: relative;
    z-index: 10;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
  }

  .auth-card-wrapper {
    flex-shrink: 0;
    z-index: 11;
  }

  .auth-card {
    width: 360px;
    position: relative;
    z-index: 10;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
    backdrop-filter: none;
    border: none;
  }

  .auth-card >>> .el-card__header {
    padding: 20px 20px 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    background: transparent;
  }

  .auth-header {
    text-align: center;
  }

  .auth-title {
    font-size: 24px;
    font-weight: bold;
    color: var(--themeBackground);
  }

  .auth-card >>> .el-card__body {
    padding: 20px;
    background: transparent;
  }

  .auth-card >>> .el-form-item {
    margin-bottom: 16px;
  }

  .auth-card >>> .el-form-item:last-child {
    margin-bottom: 0;
  }

  .auth-card >>> .el-input__inner {
    border-radius: 4px;
    border: 1px solid #dcdfe6;
  }

  .auth-button {
    width: 100%;
    height: 40px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    margin-top: 10px;
  }

  .auth-footer {
    text-align: center;
    margin-top: 15px;
  }

  .auth-footer >>> .el-link {
    font-size: 13px;
  }

  .auth-footer >>> .el-divider--vertical {
    margin: 0 8px;
  }

  /* 登录类型选择器样式 */
  .login-type-selector {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 10px;
  }

  .login-type-selector >>> .el-radio {
    margin-right: 30px;
  }

  .login-type-selector >>> .el-radio__label {
    font-size: 14px;
    color: #606266;
  }

  /* ========== 协议复选框样式 ========== */
  .agreement-item {
    margin-top: 20px !important;
  }

  .agreement-item >>> .el-checkbox__label {
    font-size: 13px;
    color: #606266;
    line-height: 1.5;
  }

  .agreement-item >>> .el-checkbox {
    width: 100%;
  }

  .agreement-item >>> .el-link {
    font-size: 13px;
    margin: 0 2px;
  }

  /* ========== 模态框样式 ========== */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal-content {
    position: relative;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    background: var(--background);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    overflow: hidden;
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid rgba(200, 200, 200, 0.2);
    background: rgba(255, 255, 255, 0.5);
  }

  .modal-header h2 {
    margin: 0;
    font-size: 18px;
    color: var(--themeBackground);
    font-weight: 600;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--red);
    transition: color 0.2s;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-close:hover {
    color: var(--break);
  }

  .modal-body {
    padding: 20px;
    overflow-y: auto;
    max-height: calc(80vh - 70px);
    font-size: 14px;
    line-height: 1.6;
    color: var(--articleFontColor);
  }

  .modal-body h3 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 16px;
    color: var(--articleFontColor);
    font-weight: 600;
  }

  .modal-body h4 {
    margin-top: 15px;
    margin-bottom: 10px;
    font-size: 14px;
    color: var(--articleFontColor);
    font-weight: 500;
  }

  .modal-body p {
    margin: 0 0 10px 0;
  }

  .modal-body ul {
    margin: 10px 0;
    padding-left: 20px;
  }

  .modal-body li {
    margin-bottom: 8px;
  }

  /* ========== 图片框样式 ========== */
  .auth-image-card {
    width: 360px;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
    backdrop-filter: none;
    border: none;
    border-right: 1px solid rgba(255, 255, 255, 0.3);
    overflow: hidden;
    position: relative;
    z-index: 9;
    flex-shrink: 0;
    min-height: 450px;
  }

  .auth-image-content {
    width: 100%;
    height: 100%;
    background-image: url('https://api.dujin.org/pic/fengjing');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  /* ========== 用户信息页面样式 ========== */
  .user-info-card {
    width: 90%;
    max-width: 1000px;
    position: relative;
    z-index: 10;
    margin-top: 40px;
    margin-bottom: 20px;
    border-radius: 18px;
    box-shadow: 0 28px 70px rgba(15, 23, 42, 0.22), 0 10px 22px rgba(15, 23, 42, 0.12);
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.7) 55%, rgba(255, 255, 255, 0.5) 100%);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.55);
    max-height: calc(100vh - 80px);
    overflow-y: auto;
  }

  .user-info-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 18px;
    background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.75), transparent 60%);
    pointer-events: none;
  }

  .user-info-card::after {
    content: '';
    position: absolute;
    inset: 10px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
    pointer-events: none;
  }

  .user-info-card >>> .el-card__header {
    padding: 24px 26px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.35);
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
  }

  .user-info-card >>> .el-card__body {
    padding: 0;
    background: transparent;
  }

  .user-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--themeBackground);
  }

  .title-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .title-text {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.5px;
    font-family: "Nunito", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  }

  .title-sub {
    font-size: 12px;
    color: rgba(33, 37, 41, 0.6);
    font-weight: 500;
  }

  .role-badge {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    color: #5b6470;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  .role-badge.admin {
    color: #0b3d91;
    background: linear-gradient(135deg, rgba(180, 210, 255, 0.85), rgba(255, 255, 255, 0.7));
  }

  .user-info-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    z-index: 1;
    padding: 24px 26px 20px;
  }

  .user-info-grid {
    display: grid;
    grid-template-columns: 320px minmax(0, 1fr);
    gap: 20px;
  }

  .profile-pane {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .profile-card {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.6));
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 16px;
    padding: 18px;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }

  /* 用户头像和简介区域 */
  .user-profile-section {
    display: flex;
    gap: 15px;
    align-items: flex-start;
  }

  .user-avatar {
    flex-shrink: 0;
    border: 4px solid rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: transform 0.3s;
    box-shadow: 0 12px 22px rgba(15, 23, 42, 0.2);
  }

  .user-avatar:hover {
    transform: scale(1.05);
  }

  .profile-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .username-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .username {
    font-size: 18px;
    font-weight: bold;
    color: var(--articleFontColor);
    word-break: break-all;
  }

  .edit-btn {
    flex-shrink: 0;
    font-size: 12px;
    color: var(--themeBackground);
    padding: 0;
    margin: 0;
    height: auto;
    line-height: 1;
  }

  .edit-btn:hover {
    color: var(--break);
  }

  .join-time {
    font-size: 12px;
    color: #909399;
  }

  .profile-meta {
    margin-top: 14px;
    padding: 10px 12px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.55);
    border: 1px dashed rgba(255, 255, 255, 0.8);
    color: #6b7280;
    font-size: 12px;
  }

  .profile-meta .meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .profile-meta .mdi-calendar {
    color: var(--themeBackground);
  }

  .form-pane {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.55));
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 16px;
    padding: 18px;
    box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }

  /* 用户表单样式 */
  .user-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .user-form >>> .el-form-item {
    margin-bottom: 0;
  }

  .form-item-no-label >>> .el-form-item__label {
    display: none;
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding: 10px 12px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.55);
    border: 1px solid rgba(255, 255, 255, 0.7);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }

  .info-label {
    font-size: 13px;
    color: #606266;
    font-weight: 500;
    flex-shrink: 0;
  }

  .info-value {
    font-size: 13px;
    color: var(--articleFontColor);
    flex: 1;
    word-break: break-all;
    min-width: 0;
  }

  .gender-group {
    display: flex;
    gap: 15px;
  }

  .gender-group >>> .el-radio {
    font-size: 13px;
  }

  /* 简介部分 */
  .intro-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .intro-label {
    font-size: 13px;
    color: #606266;
    font-weight: 500;
  }

  .intro-input {
    width: 100%;
  }

  .auth-card >>> .el-input__inner,
  .user-form >>> .el-input__inner,
  .user-form >>> .el-textarea__inner {
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    font-size: 13px;
  }

  .auth-card >>> .el-input__inner:focus,
  .user-form >>> .el-input__inner:focus,
  .user-form >>> .el-textarea__inner:focus {
    background-color: rgba(255, 255, 255, 0.8);
    border-color: var(--themeBackground);
  }

  /* 底部按钮区域 */
  .user-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    border-radius: 14px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3));
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
  }

  .save-btn {
    height: 36px;
    padding: 0 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    background: linear-gradient(135deg, var(--themeBackground), #4f7cff);
    border: none;
    box-shadow: 0 10px 18px rgba(79, 124, 255, 0.28);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .save-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 16px 26px rgba(79, 124, 255, 0.35);
  }

  .action-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .action-btn {
    font-size: 13px;
    color: var(--themeBackground);
    padding: 0;
    height: auto;
    line-height: 1.5;
  }

  .action-btn:hover {
    color: var(--break);
  }

  .logout-btn {
    color: #f56c6c;
  }

  .logout-btn:hover {
    color: #f85555;
  }

  .user-left-section {
    padding: 20px 0;
  }

  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
  }

  .submit-button {
    width: 100%;
    height: 40px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
  }

  .user-right-section {
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .user-right-section >>> .el-descriptions__content {
    color: var(--articleFontColor);
    font-size: 18px;
    font-weight: bold;
  }

  .admin-section {
    padding: 10px 0;
  }

  .admin-section >>> .el-button {
    background: linear-gradient(135deg, var(--themeBackground) 0%, #4a90e2 100%);
    border: none;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .admin-section >>> .el-button:hover {
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
    transform: translateY(-2px);
  }

  /* ========== 对话框样式 ========== */
  .el-dialog {
    background: transparent !important;
  }

  .el-dialog >>> .el-dialog {
    border-radius: 12px !important;
    background: rgba(255, 255, 255, 0.9) !important;
    -webkit-backdrop-filter: blur(10px) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
  }

  .el-dialog >>> .el-dialog__header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
    background: transparent !important;
  }

  .el-dialog >>> .el-dialog__close:hover {
    color: var(--themeBackground);
  }

  .el-dialog >>> .el-form {
    padding-right: 10px;
  }

  .el-dialog >>> .el-form-item {
    margin-bottom: 18px;
  }

  .el-dialog >>> .el-input__inner {
    background-color: rgba(255, 255, 255, 0.5) !important;
    -webkit-backdrop-filter: blur(5px) !important;
    backdrop-filter: blur(5px) !important;
    border: 1px solid rgba(200, 200, 200, 0.3) !important;
  }

  .el-dialog >>> .el-input__inner:focus {
    background-color: rgba(255, 255, 255, 0.8) !important;
    border-color: var(--themeBackground) !important;
  }

  .el-dialog >>> .el-textarea__inner {
    background-color: rgba(255, 255, 255, 0.5) !important;
    -webkit-backdrop-filter: blur(5px) !important;
    backdrop-filter: blur(5px) !important;
    border: 1px solid rgba(200, 200, 200, 0.3) !important;
  }

  .el-dialog >>> .el-textarea__inner:focus {
    background-color: rgba(255, 255, 255, 0.8) !important;
    border-color: var(--themeBackground) !important;
  }

  .el-dialog >>> .el-radio__input.is-checked .el-radio__inner {
    border-color: var(--themeBackground) !important;
    background: var(--themeBackground) !important;
  }

  /* 验证码输入框和按钮样式优化 */
  .code-input >>> .el-input__inner {
    border-radius: 4px 0 0 4px;
  }

  .code-button {
    height: 32px;
    font-size: 12px;
    padding: 0 12px !important;
    border-radius: 0 4px 4px 0;
    white-space: nowrap;
  }

  /* ========== 响应式设计 ========== */
  @media screen and (max-width: 1000px) {
    .auth-container {
      flex-direction: column;
      gap: 0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: none;
      border: none;
      background: transparent;
    }

    .auth-card-wrapper {
      z-index: 10;
    }

    .auth-card {
      border-radius: 12px;
      width: 90%;
      max-width: 340px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      margin: 0 auto;
    }

    .auth-card >>> .el-card__header {
      background: transparent;
    }

    .auth-card >>> .el-card__body {
      background: transparent;
    }

    .auth-image-card {
      display: none;
    }

    .user-info-grid {
      grid-template-columns: 1fr;
    }

    .profile-card,
    .form-pane {
      padding: 16px;
    }
  }

  @media screen and (max-width: 768px) {
    .auth-container {
      border-radius: 12px;
      overflow: hidden;
      gap: 0;
    }

    .auth-card {
      width: 95%;
      max-width: 320px;
      margin: 0 auto;
    }

    .auth-card >>> .el-form-item {
      margin-bottom: 12px;
    }

    .auth-button {
      height: 36px;
      font-size: 14px;
    }

    .auth-image-card {
      display: none;
    }

    .user-info-card {
      width: 95%;
      margin-top: 20px !important;
      margin-bottom: 10px !important;
      max-height: calc(100vh - 60px);
      border-radius: 12px;
    }

    .user-info-card >>> .el-card__header {
      padding: 15px;
    }

    .user-info-card >>> .el-card__body {
      padding: 0;
    }

    .user-header {
      font-size: 16px;
    }

    .user-info-wrapper {
      gap: 15px;
      padding: 16px;
    }

    .user-profile-section {
      gap: 12px;
    }

    .user-info-grid {
      gap: 14px;
    }

    .profile-card,
    .form-pane {
      padding: 14px;
      border-radius: 14px;
    }

    .user-avatar {
      width: 80px !important;
      height: 80px !important;
      flex-shrink: 0;
    }

    .profile-info {
      gap: 6px;
    }

    .username {
      font-size: 16px;
    }

    .join-time {
      font-size: 12px;
    }

    .user-form {
      gap: 10px;
    }

    .user-form >>> .el-form-item {
      margin-bottom: 0;
    }

    .info-label {
      font-size: 12px;
    }

    .info-value {
      font-size: 12px;
    }

    .edit-btn {
      font-size: 11px;
    }

    .gender-group {
      gap: 12px;
    }

    .gender-group >>> .el-radio {
      font-size: 12px;
    }

    .intro-label {
      font-size: 12px;
    }

    .user-form >>> .el-input__inner,
    .user-form >>> .el-textarea__inner {
      font-size: 12px;
      height: 28px;
      line-height: 28px;
    }

    .user-form >>> .el-textarea__inner {
      min-height: 70px;
    }

    .user-actions {
      gap: 10px;
      flex-wrap: wrap;
      align-items: flex-start;
      padding: 10px 12px;
    }

    .save-btn {
      height: 34px;
      font-size: 13px;
      flex: 1;
      min-width: 100px;
    }

    .action-buttons {
      gap: 8px;
      width: 100%;
    }

    .action-btn {
      font-size: 12px;
    }

    /* 优化手机端checkbox显示 */
    .agreement-item >>> .el-checkbox__label {
      font-size: 12px;
      white-space: normal;
      line-height: 1.3;
      word-break: break-word;
    }

    .agreement-item >>> .el-checkbox {
      vertical-align: top;
    }

    .auth-footer {
      margin-top: 12px;
      text-align: center;
    }

    .auth-footer >>> .el-link {
      font-size: 12px;
    }

    /* 优化el-row和el-col间距 */
    .user-info-card >>> .el-row {
      margin-right: -5px !important;
      margin-left: -5px !important;
    }

    .user-info-card >>> .el-col {
      padding-right: 5px !important;
      padding-left: 5px !important;
    }
  }

  @media screen and (max-width: 480px) {
    .auth-card {
      width: 98%;
      max-width: 100%;
      padding: 0;
    }

    .auth-card >>> .el-card__header {
      padding: 15px;
    }

    .auth-card >>> .el-card__body {
      padding: 15px;
    }

    .auth-title {
      font-size: 20px;
    }

    .auth-card >>> .el-form-item {
      margin-bottom: 10px;
    }

    .auth-button {
      height: 32px;
      font-size: 12px;
    }

    .agreement-item >>> .el-checkbox__label {
      font-size: 11px;
    }

    .login-type-selector >>> .el-radio {
      margin-right: 15px;
    }

    .login-type-selector >>> .el-radio__label {
      font-size: 12px;
    }

    /* 超小屏幕用户信息优化 */
    .user-info-card {
      width: 98%;
      margin-top: 15px !important;
      margin-bottom: 8px !important;
      border-radius: 8px;
      max-height: 75vh !important;
    }

    .user-info-card >>> .el-card__header {
      padding: 12px;
    }

    .user-info-card >>> .el-card__body {
      padding: 0;
    }

    .user-header {
      font-size: 15px;
    }

    .user-info-wrapper {
      gap: 12px;
      padding: 12px;
    }

    .user-profile-section {
      gap: 10px;
    }

    .profile-card,
    .form-pane {
      padding: 12px;
      border-radius: 12px;
    }

    .user-avatar {
      width: 70px !important;
      height: 70px !important;
    }

    .profile-info {
      gap: 4px;
    }

    .username {
      font-size: 15px;
    }

    .username-row {
      gap: 8px;
    }

    .edit-btn {
      font-size: 11px;
    }

    .join-time {
      font-size: 11px;
    }

    .user-form {
      gap: 8px;
    }

    .info-label {
      font-size: 11px;
    }

    .info-value {
      font-size: 11px;
    }

    .gender-group {
      gap: 10px;
    }

    .gender-group >>> .el-radio {
      font-size: 11px;
    }

    .intro-label {
      font-size: 11px;
    }

    .user-form >>> .el-input__inner,
    .user-form >>> .el-textarea__inner {
      font-size: 11px;
      height: 26px;
      line-height: 26px;
    }

    .user-form >>> .el-textarea__inner {
      min-height: 60px;
    }

    .user-actions {
      gap: 10px;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 10px;
    }

    .save-btn {
      height: 38px;
      font-size: 13px;
      padding: 0 24px !important;
      min-width: 120px;
      flex: 0 0 auto;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      flex: 0 1 auto;
    }

    .action-btn {
      font-size: 12px;
      padding: 0 12px !important;
      height: 32px;
      line-height: 32px;
    }

    .user-header {
      gap: 8px;
    }

    .user-header span {
      font-size: 16px;
    }

    .user-header >>> .el-button {
      height: 28px;
      font-size: 12px;
      padding: 2px 8px !important;
    }

    .avatar-section {
      margin-bottom: 15px;
    }

    .avatar-section >>> .el-button {
      font-size: 11px;
      margin-top: 5px;
    }

    .user-left-section {
      padding: 8px 0;
    }

    .user-right-section {
      padding: 12px 0;
      margin-top: 12px;
    }

    .user-form >>> .el-form-item {
      margin-bottom: 10px;
    }

    .user-form >>> .el-form-item__label {
      width: 50px !important;
      padding: 0 6px 0 0 !important;
      font-size: 12px;
    }

    .user-form >>> .el-form-item__content {
      font-size: 12px;
    }

    .user-form >>> .el-input__inner,
    .user-form >>> .el-textarea__inner {
      font-size: 12px;
      height: 28px;
      line-height: 28px;
    }

    .user-form >>> .el-textarea__inner {
      min-height: 60px;
      line-height: 1.4;
    }

    .info-display {
      font-size: 11px;
      padding: 5px 6px;
      flex-direction: column;
      gap: 4px;
      min-height: auto;
    }

    .info-display >>> .el-button {
      padding: 1px 3px !important;
      font-size: 10px;
      margin-left: 0;
    }

    .submit-button {
      height: 32px;
      font-size: 12px;
      width: 100%;
      margin-top: 5px;
    }

    .user-right-section >>> .el-descriptions__title {
      font-size: 12px;
    }

    .user-right-section >>> .el-descriptions__content {
      font-size: 13px;
    }

    .user-right-section >>> .el-divider {
      margin: 12px 0;
    }

    .admin-section >>> .el-button {
      width: 100%;
      height: 32px;
      font-size: 12px;
      padding: 2px 8px !important;
    }

    .user-form >>> .el-radio-group {
      font-size: 12px;
    }

    .user-form >>> .el-radio__label {
      font-size: 12px;
    }

    .user-form >>> .el-radio {
      margin-right: 10px;
    }

    /* 调整gutter宽度 */
    .user-info-card >>> .el-row {
      margin-right: -3px !important;
      margin-left: -3px !important;
    }

    .user-info-card >>> .el-col {
      padding-right: 3px !important;
      padding-left: 3px !important;
    }
  }

  /* 更小屏幕优化（< 380px） */
  @media screen and (max-width: 380px) {
    .user-info-card {
      width: 99%;
      border-radius: 6px;
      max-height: 70vh !important;
      margin-top: 12px !important;
      margin-bottom: 6px !important;
    }

    .user-info-wrapper {
      padding: 10px;
    }

    .profile-card,
    .form-pane {
      padding: 10px;
      border-radius: 10px;
    }

    .user-info-card >>> .el-card__header {
      padding: 10px;
    }

    .user-info-card >>> .el-card__body {
      padding: 0;
    }

    .user-header span {
      font-size: 14px;
    }

    .user-header >>> .el-button {
      height: 28px;
      font-size: 11px;
      padding: 2px 8px !important;
    }

    .user-avatar {
      width: 60px !important;
      height: 60px !important;
    }

    .avatar-section {
      margin-bottom: 10px;
    }

    .user-left-section {
      padding: 5px 0;
    }

    .user-right-section {
      padding: 8px 0;
      margin-top: 8px;
    }

    .user-form >>> .el-form-item {
      margin-bottom: 8px;
    }

    .user-form >>> .el-form-item__label {
      width: 45px !important;
      font-size: 11px;
      padding: 0 6px 0 0 !important;
    }

    .user-form >>> .el-input__inner,
    .user-form >>> .el-textarea__inner {
      font-size: 11px;
      height: 26px;
      line-height: 26px;
    }

    .info-display {
      font-size: 10px;
      padding: 4px 6px;
    }

    .info-display >>> .el-button {
      padding: 1px 3px !important;
      font-size: 9px;
    }

    .submit-button {
      height: 30px;
      font-size: 11px;
      margin-top: 3px;
    }

    .user-right-section >>> .el-descriptions {
      margin-bottom: 10px !important;
    }

    .user-right-section >>> .el-divider {
      margin: 8px 0;
    }

    .admin-section >>> .el-button {
      height: 30px;
      font-size: 11px;
    }

    .user-actions {
      gap: 8px;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .save-btn {
      height: 36px;
      font-size: 11px;
      padding: 0 18px !important;
      min-width: 100px;
      flex: 0 0 auto;
    }

    .action-buttons {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .action-btn {
      font-size: 10px;
      padding: 0 8px !important;
      height: 30px;
      line-height: 30px;
    }
  }

  /* iPhone 414x896 屏幕优化 */
  @media screen and (max-width: 414px) and (min-height: 890px) {
    .user-info-card {
      max-height: 65vh !important;
      margin-top: 10px !important;
      margin-bottom: 5px !important;
    }

    .user-info-card >>> .el-card__header {
      padding: 10px;
    }

    .user-info-card >>> .el-card__body {
      padding: 0;
    }

    .user-header {
      gap: 8px;
      font-size: 15px;
    }

    .user-header >>> .el-button {
      height: 26px;
      font-size: 11px;
      padding: 1px 6px !important;
    }

    .user-avatar {
      width: 65px !important;
      height: 65px !important;
    }

    .avatar-section {
      margin-bottom: 8px;
    }

    .avatar-section >>> .el-button {
      font-size: 11px;
      margin-top: 4px;
    }

    .user-left-section {
      padding: 4px 0;
    }

    .user-right-section {
      padding: 8px 0;
      margin-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }

    .user-form {
      margin-top: 8px;
    }

    .user-form >>> .el-form-item {
      margin-bottom: 8px;
    }

    .user-form >>> .el-form-item__label {
      width: 48px !important;
      font-size: 11px;
      padding: 0 6px 0 0 !important;
    }

    .user-form >>> .el-form-item__content {
      font-size: 11px;
    }

    .user-form >>> .el-input__inner,
    .user-form >>> .el-textarea__inner {
      font-size: 11px;
      height: 26px;
      line-height: 26px;
    }

    .user-form >>> .el-textarea__inner {
      min-height: 50px;
    }

    .info-display {
      font-size: 11px;
      padding: 4px 6px;
      flex-direction: column;
      gap: 2px;
      min-height: auto;
    }

    .info-display >>> .el-button {
      padding: 1px 3px !important;
      font-size: 9px;
    }

    .submit-button {
      height: 30px;
      font-size: 11px;
      margin-top: 2px;
    }

    .user-form >>> .el-radio-group {
      font-size: 11px;
    }

    .user-form >>> .el-radio {
      margin-right: 8px;
    }

    .user-form >>> .el-radio__label {
      font-size: 11px;
    }

    .user-right-section >>> .el-descriptions {
      margin-bottom: 8px !important;
      font-size: 11px;
    }

    .user-right-section >>> .el-descriptions__title {
      font-size: 11px;
    }

    .user-right-section >>> .el-descriptions__content {
      font-size: 12px;
      font-weight: 500;
    }

    .user-right-section >>> .el-divider {
      margin: 8px 0;
    }

    .user-right-section >>> .el-empty {
      padding: 5px 0;
    }

    .user-right-section >>> .el-empty >>> .el-empty__description {
      font-size: 11px;
    }

    .admin-section >>> .el-button {
      width: 100%;
      height: 30px;
      font-size: 11px;
      padding: 2px 8px !important;
    }

    .user-actions {
      gap: 10px;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .save-btn {
      height: 36px;
      font-size: 12px;
      padding: 0 20px !important;
      min-width: 110px;
      flex: 0 0 auto;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .action-btn {
      font-size: 11px;
      padding: 0 10px !important;
      height: 32px;
      line-height: 32px;
    }
  }

  /* ========== 背景图片样式 ========== */
  .my-el-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.4);
  }

  .image-slot {
    background-color: #f5f7fa;
  }
</style>


