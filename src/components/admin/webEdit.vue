<template>
  <div class="web-edit-page">
    <div class="web-card">
      <el-tag effect="dark" class="my-tag">
        <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -4px;">
          <path
            d="M767.1296 808.6528c16.8448 0 32.9728 2.816 48.0256 8.0384 20.6848 7.1168 43.52 1.0752 57.1904-15.9744a459.91936 459.91936 0 0 0 70.5024-122.88c7.8336-20.48 1.0752-43.264-15.9744-57.088-49.6128-40.192-65.0752-125.3888-31.3856-185.856a146.8928 146.8928 0 0 1 30.3104-37.9904c16.2304-14.5408 22.1696-37.376 13.9264-57.6a461.27104 461.27104 0 0 0-67.5328-114.9952c-13.6192-16.9984-36.4544-22.9376-57.0368-15.8208a146.3296 146.3296 0 0 1-48.0256 8.0384c-70.144 0-132.352-50.8928-145.2032-118.7328-4.096-21.6064-20.736-38.5536-42.4448-41.8304-22.0672-3.2768-44.6464-5.0176-67.6864-5.0176-21.4528 0-42.5472 1.536-63.232 4.4032-22.3232 3.1232-40.2432 20.48-43.52 42.752-6.912 46.6944-36.0448 118.016-145.7152 118.4256-17.3056 0.0512-33.8944-2.9696-49.3056-8.448-21.0432-7.4752-44.3904-1.4848-58.368 15.9232A462.14656 462.14656 0 0 0 80.4864 348.16c-7.6288 20.0192-2.7648 43.008 13.4656 56.9344 55.5008 47.8208 71.7824 122.88 37.0688 185.1392a146.72896 146.72896 0 0 1-31.6416 39.168c-16.8448 14.7456-23.0912 38.1952-14.5408 58.9312 16.896 41.0112 39.5776 79.0016 66.9696 113.0496 13.9264 17.3056 37.2736 23.1936 58.2144 15.7184 15.4112-5.4784 32-8.4992 49.3056-8.4992 71.2704 0 124.7744 49.408 142.1312 121.2928 4.9664 20.48 21.4016 36.0448 42.24 39.168 22.2208 3.328 44.9536 5.0688 68.096 5.0688 23.3984 0 46.4384-1.792 68.864-5.1712 21.3504-3.2256 38.144-19.456 42.7008-40.5504 14.8992-68.8128 73.1648-119.7568 143.7696-119.7568z"
            fill="#8C7BFD"></path>
          <path
            d="M511.8464 696.3712c-101.3248 0-183.7568-82.432-183.7568-183.7568s82.432-183.7568 183.7568-183.7568 183.7568 82.432 183.7568 183.7568-82.432 183.7568-183.7568 183.7568z m0-265.1648c-44.8512 0-81.3568 36.5056-81.3568 81.3568S466.9952 593.92 511.8464 593.92s81.3568-36.5056 81.3568-81.3568-36.5056-81.3568-81.3568-81.3568z"
            fill="#FFE37B"></path>
        </svg>
        基础信息
      </el-tag>
      <el-form :model="webInfo" :rules="rules" ref="ruleForm" label-width="80px"
               class="demo-ruleForm">
        <el-form-item label="网站名称" prop="webName">
          <el-input v-model="webInfo.webName"></el-input>
        </el-form-item>

        <el-form-item label="网站标题" prop="webTitle">
          <el-input v-model="webInfo.webTitle"></el-input>
        </el-form-item>

        <el-form-item label="页脚" prop="footer">
          <el-input v-model="webInfo.footer"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch @click.native="changeWebStatus(webInfo)" v-model="webInfo.status"></el-switch>
        </el-form-item>

        <el-form-item label="背景" prop="backgroundImage">
          <div class="url-preview-row">
            <el-input v-model="webInfo.backgroundImage"></el-input>
            <el-image lazy class="table-td-thumb"
                      :preview-src-list="[webInfo.backgroundImage]"
                      :src="webInfo.backgroundImage"
                      fit="cover"></el-image>
          </div>
          <uploadPicture :isAdmin="true" :prefix="'webBackgroundImage'" class="upload-row"
                         @addPicture="addBackgroundImage"
                         :maxSize="3"
                         :maxNumber="1"></uploadPicture>
        </el-form-item>

        <el-form-item label="头像" prop="avatar">
          <div class="url-preview-row">
            <el-input v-model="webInfo.avatar"></el-input>
            <el-image lazy class="table-td-thumb"
                      :preview-src-list="[webInfo.avatar]"
                      :src="webInfo.avatar"
                      fit="cover"></el-image>
          </div>
          <uploadPicture :isAdmin="true" :prefix="'webAvatar'" class="upload-row" @addPicture="addAvatar"
                         :maxSize="2"
                         :maxNumber="1"></uploadPicture>
        </el-form-item>

        <el-form-item label="提示" prop="waifuJson">
          <div class="waifu-editor-row">
            <el-input :disabled="disabled" :rows="6" type="textarea" v-model="webInfo.waifuJson"></el-input>
            <iconify-icon icon="mdi:pencil" @click="disabled = !disabled"></iconify-icon>
          </div>
        </el-form-item>
      </el-form>
      <div class="myCenter action-row">
        <el-button type="primary" @click="submitForm('ruleForm')">保存基本信息</el-button>
      </div>
    </div>

    <div class="web-card">
      <el-tag effect="dark" class="my-tag">
        <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -4px;">
          <path
            d="M767.1296 808.6528c16.8448 0 32.9728 2.816 48.0256 8.0384 20.6848 7.1168 43.52 1.0752 57.1904-15.9744a459.91936 459.91936 0 0 0 70.5024-122.88c7.8336-20.48 1.0752-43.264-15.9744-57.088-49.6128-40.192-65.0752-125.3888-31.3856-185.856a146.8928 146.8928 0 0 1 30.3104-37.9904c16.2304-14.5408 22.1696-37.376 13.9264-57.6a461.27104 461.27104 0 0 0-67.5328-114.9952c-13.6192-16.9984-36.4544-22.9376-57.0368-15.8208a146.3296 146.3296 0 0 1-48.0256 8.0384c-70.144 0-132.352-50.8928-145.2032-118.7328-4.096-21.6064-20.736-38.5536-42.4448-41.8304-22.0672-3.2768-44.6464-5.0176-67.6864-5.0176-21.4528 0-42.5472 1.536-63.232 4.4032-22.3232 3.1232-40.2432 20.48-43.52 42.752-6.912 46.6944-36.0448 118.016-145.7152 118.4256-17.3056 0.0512-33.8944-2.9696-49.3056-8.448-21.0432-7.4752-44.3904-1.4848-58.368 15.9232A462.14656 462.14656 0 0 0 80.4864 348.16c-7.6288 20.0192-2.7648 43.008 13.4656 56.9344 55.5008 47.8208 71.7824 122.88 37.0688 185.1392a146.72896 146.72896 0 0 1-31.6416 39.168c-16.8448 14.7456-23.0912 38.1952-14.5408 58.9312 16.896 41.0112 39.5776 79.0016 66.9696 113.0496 13.9264 17.3056 37.2736 23.1936 58.2144 15.7184 15.4112-5.4784 32-8.4992 49.3056-8.4992 71.2704 0 124.7744 49.408 142.1312 121.2928 4.9664 20.48 21.4016 36.0448 42.24 39.168 22.2208 3.328 44.9536 5.0688 68.096 5.0688 23.3984 0 46.4384-1.792 68.864-5.1712 21.3504-3.2256 38.144-19.456 42.7008-40.5504 14.8992-68.8128 73.1648-119.7568 143.7696-119.7568z"
            fill="#8C7BFD"></path>
          <path
            d="M511.8464 696.3712c-101.3248 0-183.7568-82.432-183.7568-183.7568s82.432-183.7568 183.7568-183.7568 183.7568 82.432 183.7568 183.7568-82.432 183.7568-183.7568 183.7568z m0-265.1648c-44.8512 0-81.3568 36.5056-81.3568 81.3568S466.9952 593.92 511.8464 593.92s81.3568-36.5056 81.3568-81.3568-36.5056-81.3568-81.3568-81.3568z"
            fill="#FFE37B"></path>
        </svg>
        公告
      </el-tag>
      <el-tag
        :key="i"
        v-for="(notice, i) in notices"
        closable
        :disable-transitions="false"
        @close="handleClose(notices, notice)">
        {{notice}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputNoticeVisible"
        v-model="inputNoticeValue"
        ref="saveNoticeInput"
        size="small"
        @keyup.enter.native="handleInputNoticeConfirm"
        @blur="handleInputNoticeConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showNoticeInput()">+ 公告</el-button>
      <div class="myCenter action-row">
        <el-button type="primary" @click="saveNotice()">保存公告</el-button>
      </div>
    </div>

    <div class="web-card">
      <el-tag effect="dark" class="my-tag">
        <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -4px;">
          <path
            d="M767.1296 808.6528c16.8448 0 32.9728 2.816 48.0256 8.0384 20.6848 7.1168 43.52 1.0752 57.1904-15.9744a459.91936 459.91936 0 0 0 70.5024-122.88c7.8336-20.48 1.0752-43.264-15.9744-57.088-49.6128-40.192-65.0752-125.3888-31.3856-185.856a146.8928 146.8928 0 0 1 30.3104-37.9904c16.2304-14.5408 22.1696-37.376 13.9264-57.6a461.27104 461.27104 0 0 0-67.5328-114.9952c-13.6192-16.9984-36.4544-22.9376-57.0368-15.8208a146.3296 146.3296 0 0 1-48.0256 8.0384c-70.144 0-132.352-50.8928-145.2032-118.7328-4.096-21.6064-20.736-38.5536-42.4448-41.8304-22.0672-3.2768-44.6464-5.0176-67.6864-5.0176-21.4528 0-42.5472 1.536-63.232 4.4032-22.3232 3.1232-40.2432 20.48-43.52 42.752-6.912 46.6944-36.0448 118.016-145.7152 118.4256-17.3056 0.0512-33.8944-2.9696-49.3056-8.448-21.0432-7.4752-44.3904-1.4848-58.368 15.9232A462.14656 462.14656 0 0 0 80.4864 348.16c-7.6288 20.0192-2.7648 43.008 13.4656 56.9344 55.5008 47.8208 71.7824 122.88 37.0688 185.1392a146.72896 146.72896 0 0 1-31.6416 39.168c-16.8448 14.7456-23.0912 38.1952-14.5408 58.9312 16.896 41.0112 39.5776 79.0016 66.9696 113.0496 13.9264 17.3056 37.2736 23.1936 58.2144 15.7184 15.4112-5.4784 32-8.4992 49.3056-8.4992 71.2704 0 124.7744 49.408 142.1312 121.2928 4.9664 20.48 21.4016 36.0448 42.24 39.168 22.2208 3.328 44.9536 5.0688 68.096 5.0688 23.3984 0 46.4384-1.792 68.864-5.1712 21.3504-3.2256 38.144-19.456 42.7008-40.5504 14.8992-68.8128 73.1648-119.7568 143.7696-119.7568z"
            fill="#8C7BFD"></path>
          <path
            d="M511.8464 696.3712c-101.3248 0-183.7568-82.432-183.7568-183.7568s82.432-183.7568 183.7568-183.7568 183.7568 82.432 183.7568 183.7568-82.432 183.7568-183.7568 183.7568z m0-265.1648c-44.8512 0-81.3568 36.5056-81.3568 81.3568S466.9952 593.92 511.8464 593.92s81.3568-36.5056 81.3568-81.3568-36.5056-81.3568-81.3568-81.3568z"
            fill="#FFE37B"></path>
        </svg>
        随机名称
      </el-tag>
      <el-tag
        :key="i"
        effect="dark"
        v-for="(name, i) in randomName"
        closable
        :disable-transitions="false"
        :type="types[Math.floor(Math.random() * 5)]"
        @close="handleClose(randomName, name)">
        {{name}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputRandomNameVisible"
        v-model="inputRandomNameValue"
        ref="saveRandomNameInput"
        size="small"
        @keyup.enter.native="handleInputRandomNameConfirm"
        @blur="handleInputRandomNameConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showRandomNameInput">+ 随机名称</el-button>
      <div class="myCenter action-row">
        <el-button type="primary" @click="saveRandomName()">保存随机名称</el-button>
      </div>
    </div>

    <div class="web-card">
      <el-tag effect="dark" class="my-tag">
        <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -4px;">
          <path
            d="M767.1296 808.6528c16.8448 0 32.9728 2.816 48.0256 8.0384 20.6848 7.1168 43.52 1.0752 57.1904-15.9744a459.91936 459.91936 0 0 0 70.5024-122.88c7.8336-20.48 1.0752-43.264-15.9744-57.088-49.6128-40.192-65.0752-125.3888-31.3856-185.856a146.8928 146.8928 0 0 1 30.3104-37.9904c16.2304-14.5408 22.1696-37.376 13.9264-57.6a461.27104 461.27104 0 0 0-67.5328-114.9952c-13.6192-16.9984-36.4544-22.9376-57.0368-15.8208a146.3296 146.3296 0 0 1-48.0256 8.0384c-70.144 0-132.352-50.8928-145.2032-118.7328-4.096-21.6064-20.736-38.5536-42.4448-41.8304-22.0672-3.2768-44.6464-5.0176-67.6864-5.0176-21.4528 0-42.5472 1.536-63.232 4.4032-22.3232 3.1232-40.2432 20.48-43.52 42.752-6.912 46.6944-36.0448 118.016-145.7152 118.4256-17.3056 0.0512-33.8944-2.9696-49.3056-8.448-21.0432-7.4752-44.3904-1.4848-58.368 15.9232A462.14656 462.14656 0 0 0 80.4864 348.16c-7.6288 20.0192-2.7648 43.008 13.4656 56.9344 55.5008 47.8208 71.7824 122.88 37.0688 185.1392a146.72896 146.72896 0 0 1-31.6416 39.168c-16.8448 14.7456-23.0912 38.1952-14.5408 58.9312 16.896 41.0112 39.5776 79.0016 66.9696 113.0496 13.9264 17.3056 37.2736 23.1936 58.2144 15.7184 15.4112-5.4784 32-8.4992 49.3056-8.4992 71.2704 0 124.7744 49.408 142.1312 121.2928 4.9664 20.48 21.4016 36.0448 42.24 39.168 22.2208 3.328 44.9536 5.0688 68.096 5.0688 23.3984 0 46.4384-1.792 68.864-5.1712 21.3504-3.2256 38.144-19.456 42.7008-40.5504 14.8992-68.8128 73.1648-119.7568 143.7696-119.7568z"
            fill="#8C7BFD"></path>
          <path
            d="M511.8464 696.3712c-101.3248 0-183.7568-82.432-183.7568-183.7568s82.432-183.7568 183.7568-183.7568 183.7568 82.432 183.7568 183.7568-82.432 183.7568-183.7568 183.7568z m0-265.1648c-44.8512 0-81.3568 36.5056-81.3568 81.3568S466.9952 593.92 511.8464 593.92s81.3568-36.5056 81.3568-81.3568-36.5056-81.3568-81.3568-81.3568z"
            fill="#FFE37B"></path>
        </svg>
        随机头像
      </el-tag>
      <div :key="i"
           class="asset-row"
           v-for="(avatar, i) in randomAvatar">
        <el-tag closable
          :disable-transitions="false"
          @close="handleClose(randomAvatar, avatar)">
          {{avatar}}
        </el-tag>
        <div class="asset-preview">
          <el-image lazy class="table-td-thumb"
                    :preview-src-list="[avatar]"
                    :src="avatar"
                    fit="cover"></el-image>
        </div>
      </div>

      <el-input
        class="input-new-tag"
        v-if="inputRandomAvatarVisible"
        v-model="inputRandomAvatarValue"
        ref="saveRandomAvatarInput"
        size="small"
        @keyup.enter.native="handleInputRandomAvatarConfirm"
        @blur="handleInputRandomAvatarConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showRandomAvatarInput">+ 随机头像</el-button>
      <uploadPicture :isAdmin="true" :prefix="'randomAvatar'" class="upload-row" @addPicture="addRandomAvatar"
                     :maxSize="1"
                     :maxNumber="5"></uploadPicture>
      <div class="myCenter action-row">
        <el-button type="primary" @click="saveRandomAvatar()">保存随机头像</el-button>
      </div>
    </div>

    <div class="web-card">
      <el-tag effect="dark" class="my-tag">
        <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -4px;">
          <path
            d="M767.1296 808.6528c16.8448 0 32.9728 2.816 48.0256 8.0384 20.6848 7.1168 43.52 1.0752 57.1904-15.9744a459.91936 459.91936 0 0 0 70.5024-122.88c7.8336-20.48 1.0752-43.264-15.9744-57.088-49.6128-40.192-65.0752-125.3888-31.3856-185.856a146.8928 146.8928 0 0 1 30.3104-37.9904c16.2304-14.5408 22.1696-37.376 13.9264-57.6a461.27104 461.27104 0 0 0-67.5328-114.9952c-13.6192-16.9984-36.4544-22.9376-57.0368-15.8208a146.3296 146.3296 0 0 1-48.0256 8.0384c-70.144 0-132.352-50.8928-145.2032-118.7328-4.096-21.6064-20.736-38.5536-42.4448-41.8304-22.0672-3.2768-44.6464-5.0176-67.6864-5.0176-21.4528 0-42.5472 1.536-63.232 4.4032-22.3232 3.1232-40.2432 20.48-43.52 42.752-6.912 46.6944-36.0448 118.016-145.7152 118.4256-17.3056 0.0512-33.8944-2.9696-49.3056-8.448-21.0432-7.4752-44.3904-1.4848-58.368 15.9232A462.14656 462.14656 0 0 0 80.4864 348.16c-7.6288 20.0192-2.7648 43.008 13.4656 56.9344 55.5008 47.8208 71.7824 122.88 37.0688 185.1392a146.72896 146.72896 0 0 1-31.6416 39.168c-16.8448 14.7456-23.0912 38.1952-14.5408 58.9312 16.896 41.0112 39.5776 79.0016 66.9696 113.0496 13.9264 17.3056 37.2736 23.1936 58.2144 15.7184 15.4112-5.4784 32-8.4992 49.3056-8.4992 71.2704 0 124.7744 49.408 142.1312 121.2928 4.9664 20.48 21.4016 36.0448 42.24 39.168 22.2208 3.328 44.9536 5.0688 68.096 5.0688 23.3984 0 46.4384-1.792 68.864-5.1712 21.3504-3.2256 38.144-19.456 42.7008-40.5504 14.8992-68.8128 73.1648-119.7568 143.7696-119.7568z"
            fill="#8C7BFD"></path>
          <path
            d="M511.8464 696.3712c-101.3248 0-183.7568-82.432-183.7568-183.7568s82.432-183.7568 183.7568-183.7568 183.7568 82.432 183.7568 183.7568-82.432 183.7568-183.7568 183.7568z m0-265.1648c-44.8512 0-81.3568 36.5056-81.3568 81.3568S466.9952 593.92 511.8464 593.92s81.3568-36.5056 81.3568-81.3568-36.5056-81.3568-81.3568-81.3568z"
            fill="#FFE37B"></path>
        </svg>
        随机封面
      </el-tag>
      <div :key="i"
           class="asset-row"
           v-for="(cover, i) in randomCover">
        <el-tag closable
          :disable-transitions="false"
          @close="handleClose(randomCover, cover)">
          {{cover}}
        </el-tag>
        <div class="asset-preview">
          <el-image lazy class="table-td-thumb"
                    :preview-src-list="[cover]"
                    :src="cover"
                    fit="cover"></el-image>
        </div>
      </div>

      <el-input
        class="input-new-tag"
        v-if="inputRandomCoverVisible"
        v-model="inputRandomCoverValue"
        ref="saveRandomCoverInput"
        size="small"
        @keyup.enter.native="handleInputRandomCoverConfirm"
        @blur="handleInputRandomCoverConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showRandomCoverInput">+ 随机封面</el-button>
      <uploadPicture :isAdmin="true" :prefix="'randomCover'" class="upload-row" @addPicture="addRandomCover"
                     :maxSize="2"
                     :maxNumber="5"></uploadPicture>
      <div class="myCenter action-row action-row-last">
        <el-button type="primary" @click="saveRandomCover()">保存随机封面</el-button>
      </div>
    </div>

    <div class="danger-row">
      <el-button type="danger" @click="resetForm('ruleForm')">重置所有修改</el-button>
    </div>
  </div>
</template>

<script>
  const uploadPicture = () => import( "../common/uploadPicture");

  export default {
    components: {
      uploadPicture
    },
    data() {
      return {
        disabled: true,
        types: ['', 'success', 'info', 'danger', 'warning'],
        inputNoticeVisible: false,
        inputNoticeValue: "",
        inputRandomNameVisible: false,
        inputRandomNameValue: "",
        inputRandomAvatarVisible: false,
        inputRandomAvatarValue: "",
        inputRandomCoverVisible: false,
        inputRandomCoverValue: "",
        webInfo: {
          id: null,
          webName: "",
          webTitle: "",
          footer: "",
          backgroundImage: "",
          avatar: "",
          waifuJson: "",
          status: false
        },
        notices: [],
        randomAvatar: [],
        randomName: [],
        randomCover: [],
        rules: {
          webName: [
            {required: true, message: '请输入网站名称', trigger: 'blur'},
            {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change'}
          ],
          webTitle: [
            {required: true, message: '请输入网站标题', trigger: 'blur'}
          ],
          footer: [
            {required: true, message: '请输入页脚', trigger: 'blur'}
          ],
          backgroundImage: [
            {required: true, message: '请输入背景', trigger: 'change'}
          ],
          status: [
            {required: true, message: '请设置网站状态', trigger: 'change'}
          ],
          avatar: [
            {required: true, message: '请上传头像', trigger: 'change'}
          ]
        }
      }
    },

    computed: {},

    watch: {},

    created() {
      this.getWebInfo();
    },

    mounted() {

    },

    methods: {
      addBackgroundImage(res) {
        this.webInfo.backgroundImage = res;
      },
      addAvatar(res) {
        this.webInfo.avatar = res;
      },
      addRandomAvatar(res) {
        this.randomAvatar.push(res);
      },
      addRandomCover(res) {
        this.randomCover.push(res);
      },
      changeWebStatus(webInfo) {
        this.$http.post(this.$constant.baseURL + "/webInfo/updateWebInfo", {
          id: webInfo.id,
          status: webInfo.status
        }, true)
          .then((res) => {
            this.getWebInfo();
            this.$message({
              message: "保存成功！",
              type: "success"
            });
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      getWebInfo() {
        this.$http.get(this.$constant.baseURL + "/admin/webInfo/getAdminWebInfo", {}, true)
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.webInfo.id = res.data.id;
              this.webInfo.webName = res.data.webName;
              this.webInfo.webTitle = res.data.webTitle;
              this.webInfo.footer = res.data.footer;
              this.webInfo.backgroundImage = res.data.backgroundImage;
              this.webInfo.avatar = res.data.avatar;
              this.webInfo.waifuJson = res.data.waifuJson;
              this.webInfo.status = res.data.status;
              this.notices = JSON.parse(res.data.notices);
              this.randomAvatar = JSON.parse(res.data.randomAvatar);
              this.randomName = JSON.parse(res.data.randomName);
              this.randomCover = JSON.parse(res.data.randomCover);
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updateWebInfo(this.webInfo)
          } else {
            this.$message({
              message: "请完善必填项！",
              type: "error"
            });
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.getWebInfo();
      },
      handleClose(array, item) {
        array.splice(array.indexOf(item), 1);
      },
      handleInputNoticeConfirm() {
        if (this.inputNoticeValue) {
          this.notices.push(this.inputNoticeValue);
        }
        this.inputNoticeVisible = false;
        this.inputNoticeValue = '';
      },
      showNoticeInput() {
        this.inputNoticeVisible = true;
        this.$nextTick(() => {
          this.$refs.saveNoticeInput.$refs.input.focus();
        });
      },
      saveNotice() {
        let param = {
          id: this.webInfo.id,
          notices: JSON.stringify(this.notices)
        }
        this.updateWebInfo(param);
      },
      handleInputRandomNameConfirm() {
        if (this.inputRandomNameValue) {
          this.randomName.push(this.inputRandomNameValue);
        }
        this.inputRandomNameVisible = false;
        this.inputRandomNameValue = '';
      },
      showRandomNameInput() {
        this.inputRandomNameVisible = true;
        this.$nextTick(() => {
          this.$refs.saveRandomNameInput.$refs.input.focus();
        });
      },
      saveRandomName() {
        let param = {
          id: this.webInfo.id,
          randomName: JSON.stringify(this.randomName)
        }
        this.updateWebInfo(param);
      },
      handleInputRandomAvatarConfirm() {
        if (this.inputRandomAvatarValue) {
          this.randomAvatar.push(this.inputRandomAvatarValue);
        }
        this.inputRandomAvatarVisible = false;
        this.inputRandomAvatarValue = '';
      },
      showRandomAvatarInput() {
        this.inputRandomAvatarVisible = true;
        this.$nextTick(() => {
          this.$refs.saveRandomAvatarInput.$refs.input.focus();
        });
      },
      saveRandomAvatar() {
        let param = {
          id: this.webInfo.id,
          randomAvatar: JSON.stringify(this.randomAvatar)
        }
        this.updateWebInfo(param);
      },
      handleInputRandomCoverConfirm() {
        if (this.inputRandomCoverValue) {
          this.randomCover.push(this.inputRandomCoverValue);
        }
        this.inputRandomCoverVisible = false;
        this.inputRandomCoverValue = '';
      },
      showRandomCoverInput() {
        this.inputRandomCoverVisible = true;
        this.$nextTick(() => {
          this.$refs.saveRandomCoverInput.$refs.input.focus();
        });
      },
      saveRandomCover() {
        let param = {
          id: this.webInfo.id,
          randomCover: JSON.stringify(this.randomCover)
        }
        this.updateWebInfo(param);
      },
      updateWebInfo(value) {
        this.$confirm('确认保存？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success',
          center: true
        }).then(() => {
          this.$http.post(this.$constant.baseURL + "/webInfo/updateWebInfo", value, true)
            .then((res) => {
              this.getWebInfo();
              this.$message({
                message: "保存成功！",
                type: "success"
              });
            })
            .catch((error) => {
              this.$message({
                message: error.message,
                type: "error"
              });
            });
        }).catch(() => {
          this.$message({
            type: 'success',
            message: '已取消保存!'
          });
        });
      }
    }
  }
</script>

<style scoped>

  .web-edit-page {
    --panel-bg-start: rgba(255, 255, 255, 0.86);
    --panel-bg-end: rgba(247, 251, 255, 0.94);
    --panel-border: rgba(120, 161, 231, 0.24);
    --panel-shadow: 0 16px 32px rgba(34, 62, 96, 0.14);
    --chip-bg: linear-gradient(145deg, #f7f9ff, #eaf2ff);
    position: relative;
    padding: 10px 14px 24px;
    border-radius: 18px;
    background:
      radial-gradient(circle at 14% 8%, rgba(94, 170, 255, 0.2), transparent 38%),
      radial-gradient(circle at 86% 5%, rgba(255, 182, 109, 0.18), transparent 40%),
      linear-gradient(180deg, #f5f9ff 0%, #edf4ff 100%);
    overflow: hidden;
  }

  .web-edit-page::before,
  .web-edit-page::after {
    content: "";
    position: absolute;
    border-radius: 999px;
    filter: blur(40px);
    opacity: 0.45;
    pointer-events: none;
  }

  .web-edit-page::before {
    width: 150px;
    height: 150px;
    top: -48px;
    right: -40px;
    background: #8cb9ff;
  }

  .web-edit-page::after {
    width: 190px;
    height: 190px;
    bottom: -78px;
    left: -55px;
    background: #ffd49c;
  }

  .web-card {
    position: relative;
    z-index: 1;
    margin-bottom: 18px;
    padding: 14px 16px 8px;
    border-radius: 16px;
    border: 1px solid var(--panel-border);
    background: linear-gradient(170deg, var(--panel-bg-start), var(--panel-bg-end));
    box-shadow: var(--panel-shadow);
    backdrop-filter: blur(3px);
    transition: transform 0.28s ease, box-shadow 0.28s ease;
    animation: card-rise 0.45s ease both;
  }

  .web-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 36px rgba(23, 56, 93, 0.18);
  }

  .web-card:nth-child(2) {
    animation-delay: 0.04s;
  }

  .web-card:nth-child(3) {
    animation-delay: 0.08s;
  }

  .web-card:nth-child(4) {
    animation-delay: 0.12s;
  }

  .web-card:nth-child(5) {
    animation-delay: 0.16s;
  }

  .web-card:nth-child(6) {
    animation-delay: 0.2s;
  }

  .my-tag {
    width: 100% !important;
    max-width: 100% !important;
    text-align: left;
    background: linear-gradient(120deg, rgba(255, 243, 191, 0.95), rgba(255, 226, 161, 0.85));
    border: 1px solid rgba(255, 203, 109, 0.4);
    box-shadow: 0 8px 18px rgba(229, 178, 68, 0.2);
    height: 42px;
    line-height: 42px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    color: #3c2d0d;
    margin: 4px 0 20px !important;
  }

  .el-tag {
    max-width: calc(100% - 20px);
    white-space: normal;
    height: unset;
    margin: 10px;
    border-radius: 10px;
    border: 1px solid rgba(124, 164, 233, 0.25);
    background: var(--chip-bg);
    box-shadow: 0 6px 12px rgba(32, 65, 103, 0.08);
  }

  .button-new-tag {
    margin: 10px;
    height: 32px;
    line-height: 32px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    max-width: calc(100% - 20px);
    margin: 10px;
  }

  .url-preview-row,
  .waifu-editor-row,
  .asset-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .url-preview-row .el-input,
  .waifu-editor-row .el-input {
    flex: 1;
  }

  .asset-row {
    margin: 6px 0;
    padding: 8px 10px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.68);
    border: 1px solid rgba(126, 170, 237, 0.2);
  }

  .asset-preview {
    display: flex;
    align-items: center;
  }

  .upload-row {
    margin-top: 14px;
  }

  .action-row {
    margin: 8px 0 22px;
  }

  .action-row-last {
    margin-bottom: 32px;
  }

  .danger-row {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .my-icon {
    cursor: pointer;
    margin-left: 2px;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: bold;
    color: #2f70d6;
    background: rgba(234, 244, 255, 0.95);
    border: 1px solid rgba(120, 163, 234, 0.38);
    transition: transform 0.22s ease, box-shadow 0.22s ease;
  }

  .my-icon:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 14px rgba(41, 95, 173, 0.24);
  }

  .table-td-thumb {
    border-radius: 10px;
    width: 48px;
    height: 48px;
    border: 1px solid rgba(111, 157, 229, 0.4);
    box-shadow: 0 10px 18px rgba(40, 77, 122, 0.2);
  }

  .web-edit-page /deep/ .el-form-item__label {
    font-weight: 600;
    color: #2f4362;
  }

  .web-edit-page /deep/ .el-input__inner,
  .web-edit-page /deep/ .el-textarea__inner {
    border-radius: 10px;
    border-color: rgba(127, 164, 223, 0.42);
    background: rgba(255, 255, 255, 0.88);
    box-shadow: inset 0 1px 3px rgba(40, 68, 112, 0.06);
  }

  .web-edit-page /deep/ .el-button--primary {
    border: none;
    border-radius: 10px;
    background: linear-gradient(130deg, #2f86ff, #59a8ff);
    box-shadow: 0 10px 18px rgba(42, 120, 221, 0.3);
  }

  .web-edit-page /deep/ .el-button--danger {
    border: none;
    border-radius: 10px;
    background: linear-gradient(130deg, #ef5a63, #f67f5b);
    box-shadow: 0 10px 20px rgba(201, 68, 62, 0.28);
  }

  @keyframes card-rise {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .web-edit-page {
      padding: 8px 8px 18px;
    }

    .web-card {
      padding: 12px 10px 8px;
      border-radius: 12px;
    }

    .url-preview-row,
    .waifu-editor-row,
    .asset-row {
      flex-direction: column;
      align-items: stretch;
    }

    .table-td-thumb {
      width: 100%;
      height: 120px;
    }

    .asset-preview {
      width: 100%;
    }

    .my-tag {
      font-size: 15px;
    }
  }

</style>


