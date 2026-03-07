<template>
  <div class="myFooter-wrap" v-show="showFooter">
    <div class="myFooter">
      <div class="footer-title">{{$store.state.webInfo.footer}}</div>
       <hr class="hr-1"/>
      <div class="icp">
        <a title="本站用户许可协议" @click="showAboutModal = true" style="cursor: pointer;">关于本站</a>丨
        <a title="本站版权与隐私协议" @click="showPrivacyModal = true" style="cursor: pointer;">版权与隐私协议</a>丨
        <a title="网站地图" href="https://czpv.top/sitemap.xml" style="cursor: default;">网站地图</a>丨
        <a title="个人邮箱" href="mailto:czp9919@outlook.com" style="cursor: default;">联系方式</a>丨
        <a title="本站基于Poetize二次开发" href="https://poetize.cn/" style="cursor: default;">Poetize</a>
      </div>
      <div class="icp2">
        <a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2026009961号</a>丨
        <span></span>

        <a href="https://czpv.top" target="_blank">
          <svg  t="1687936922521" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3170" width="10" height="10" class="icon">
            <path  d="M511.965867 1011.165867C236.7488 1011.165867 12.834133 787.217067 12.834133 512S236.7488 12.834133 511.965867 12.834133C787.217067 12.834133 1011.165867 236.782933 1011.165867 512s-223.9488 499.165867-499.2 499.165867z m0-930.0992C274.397867 81.066667 81.1008 274.397867 81.1008 512s193.297067 430.933333 430.865067 430.933333c237.636267 0 430.933333-193.297067 430.933333-430.933333 0-237.602133-193.297067-430.933333-430.933333-430.933333z" fill="#515151" p-id="3171">

            </path>
            <path  d="M564.0192 758.4768c-135.918933 0-246.545067-110.523733-246.545067-246.4768 0-135.918933 110.592-246.510933 246.545067-246.510933 33.314133 0 65.604267 6.519467 96.017067 19.387733l-26.658134 62.8736A178.4832 178.4832 0 0 0 385.774933 512a178.449067 178.449067 0 0 0 178.2784 178.210133c32.085333 0 63.488-8.6016 90.794667-24.8832l34.9184 58.6752a245.9648 245.9648 0 0 1-125.7472 34.474667z" fill="#515151" p-id="3172">

            </path>
          </svg>
          Copyright 2026 CZP
        </a>
      </div>


    </div>

    <!-- 关于弹窗 -->
    <div v-if="showAboutModal" class="modal-overlay" @click="showAboutModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h1>📬关于本站</h1>
          <button class="modal-close" @click="showAboutModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <h1>用户协议</h1>
            <p><i>CZP</i>（以下简称“我们”）依据本协议为用户（以下简称“你”）提供<i>czpv.top</i>服务。本协议对你和我们均具有法律约束力。</p>
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

    <!-- 版权与隐私协议弹窗 -->
    <div v-if="showPrivacyModal" class="modal-overlay" @click="showPrivacyModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h1>🔒本站的版权与隐私协议</h1>
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
  </div>
</template>

<script>
  export default {
    props: {
      showFooter: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        showAboutModal: false,
        showPrivacyModal: false
      }
    },
    created() {
    }
  }

</script>

<style scoped>
  .myFooter-wrap {
    user-select: none;
    animation: hideToShow 2s;
  }

  .myFooter {
    border-radius: 1.5rem 1.5rem 0 0;
    background: var(--gradientBG);
    text-align: center;
    color: var(--white);
    background-size: 300% 300%;
    animation: gradientBG 10s ease infinite;
  }

  .footer-title {
    padding-top: 10px;
    font-size: 16px;
  }

  .icp2 a, .icp a {
    color: var(--maxGreyFont);
    font-size: 13px;
  }

  .icp {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .icp2 a, .icp a {
    text-decoration: none;
    transition: all 0.3s;
  }

  .icp a:hover, .icp2 a:hover {
    color: var(--themeBackground);
  }
  hr.hr-1 {
    width: 50%;
    margin: 0 auto;
    border: 0;
    height: .1rem;
    background-image: linear-gradient(90deg,transparent,rgba(72,131,208,.36),transparent);
}


  .hr {
    display: block;
    unicode-bidi: isolate;
    margin-block-start: 0.5em;
    margin-block-end: 0.5em;
    margin-inline-start: auto;
    margin-inline-end: auto;
    overflow: hidden;
    border-style: inset;
    border-width: 1px;
}

.icp2 {
    padding-bottom: 10px;
}
.icp2, .icp {
    color: var(--maxGreyFont);
    font-size: 10px;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s;
}

.modal-content {
  background: var(--background);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--articleFontColor);
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: var(--red);
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.modal-close:hover {
  color: var(--break);
}

.modal-body {
  padding: 20px;
  color: var(--articleFontColor);
  line-height: 1.6;
}

.modal-body p {
  margin: 10px 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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


</style>
