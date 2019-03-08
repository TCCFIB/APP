<template>
  <div id="app">
    <div id="nav">
      <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
        <el-radio-button :label="false">expand</el-radio-button>
        <el-radio-button :label="true">collapse</el-radio-button>
      </el-radio-group> -->
      <el-menu
        class="el-menu-vertical-demo"
        :collapse="true"
        :default-active="activeMenu"
      >
        <el-menu-item index="1" @click="navegateTo('PromotionList')">
          <i class="fa pr-i fa-shopping-cart"></i>
          <span slot="title">Promoções</span>
        </el-menu-item>
        <el-menu-item index="2" @click="navegateTo('CouponList')">
          <i class="fa pr-i fa-tags"></i>
          <span slot="title">Cupons</span>
        </el-menu-item>
        <el-menu-item index="3" :disabled="!isLoggedIn" @click="navegateTo('AccountManage')">
          <i class="fa pr-i fa-user"></i>
          <span slot="title">Editar perfil</span>
        </el-menu-item>
        <el-menu-item index="4" v-show="!isLoggedIn" @click="navegateTo('Login')">
          <i class="fa pr-i fa-sign-in-alt"></i>
          <span slot="title">Entrar</span>
        </el-menu-item>
        <el-menu-item index="5" v-show="isLoggedIn" @click="logOut">
          <i class="fa pr-i fa-sign-out-alt"></i>
          <span slot="title">Sair</span>
        </el-menu-item>
        <el-menu-item class="secret-button" index="6" @click="changeBaseUrl"></el-menu-item>
      </el-menu>
    </div>

    <div id="main">
      <router-view />
    </div>

    <el-dialog title="Trocar a URL base" :fullscreen="true" :visible.sync="dialogChangeBaseUrlVisible" @close="resetForm">
      <el-form :model="baseUrlForm" ref="baseUrlForm" label-position="top">
        <el-form-item label="Nova URL base (Ex.: http://localhost)" prop="url">
          <el-input v-model="baseUrlForm.url" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">Cancelar</el-button>
        <el-button type="primary" @click="submitForm">Cadastrar</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogChangeBaseUrlVisible: false,
      baseUrlForm: {
        url: 'http://',
      },
    };
  },
  computed: {
    activeMenu() {
      switch(this.$route.name) {
        case 'PromotionList':
        default:
          return '1';
          break;
        case 'AccountManage':
          return '3';
          break;
        case 'Login':
          return '4';
          break;
      }
    },
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
  },
  methods: {
    navegateTo(routeName = 'Login') {
      this.$router.push({
        // name: !this.isLoggedIn ? 'Login' : routeName,
        name: routeName,
      });
    },
    logOut() {
      this.$store.dispatch('unsetUserData');
      this.navegateTo('Login');
    },
    changeBaseUrl() {
      this.dialogChangeBaseUrlVisible = true;
    },
    submitForm() {
      this.$store.dispatch('changeBaseUrl', this.baseUrlForm.url);
      this.resetForm();
    },
    resetForm() {
      this.$refs['baseUrlForm'].resetFields();
      this.dialogChangeBaseUrlVisible = false;
    },
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

.secret-button {
  bottom: 0 !important;
  position: absolute !important;
  width: 65px !important;
}

html,
body {
  font-family: 'Open Sans', sans-serif;
  margin: 0;
  padding: 0;
}

#app {
  margin: 10px 10px 0 0;
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
}
#nav {
  float: left;
  width: 75px;
  height: 97%;
  position: fixed;

  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  ul {
    height: 100%;
  }
}
#main {
  width: calc(100% - 75px);
  float: right;
}

// ELEMENT-UI OVERRIDE
.el-card__body {
  padding: 0 !important;
}

.el-form--label-top .el-form-item__label {
  float: left !important;
  padding: 10px 0 0 0 !important;
}

.el-message {
  min-width: 95% !important;
}

.promotion-like {
  .el-button {
    padding: 0 !important;
    color: #909399;
    &:hover {
      color: #909399;
    }
  }
  &.active {
    .el-button {
      color: #66bb6a;
      &:hover {
        color: #66bb6a;
      }
    }
  }
}

.promotion-report {
  .el-button {
    padding: 0 !important;
    color: #909399;
    &:hover {
      color: #909399;
    }
  }
  &.active {
    .el-button {
      padding: 0 !important;
      color: #ff7043;
      &:hover {
        color: #ff7043;
      }
    }
  }
}
</style>
