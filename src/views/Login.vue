<template>
  <div id="login-container">
    <el-form
      :model="ruleForm2"
      status-icon
      :rules="rules2"
      ref="ruleForm2"
      label-width="120px"
      class="demo-ruleForm"
      label-position="top"
    >
      <el-form-item prop="email" label="Email">
        <el-input v-model="ruleForm2.email"></el-input>
      </el-form-item>
      <el-form-item label="Senha" prop="pass">
        <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-button
        class="newAccountBtn"
        @click="navegateToAccountManage"
        type="text"
      >
        Criar nova conta
      </el-button>
      <el-form-item>
        <el-button @click="resetForm('ruleForm2')">Cancelar</el-button>
        <el-button type="primary" @click="submitForm('ruleForm2')">Entrar</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      ruleForm2: {
        pass: '',
        email: '',
      },
      rules2: {
        email: [
          { required: true, message: 'Por favor digite seu email', trigger: 'blur' },
          { type: 'email', message: 'Endereço de email inválido', trigger: ['blur', 'change'] },
        ],
        pass: [
          { required: true, message: 'Por favor digite uma senha', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    navegateToAccountManage() {
      this.$router.push({
        name: 'AccountManage',
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            message: 'Logado com sucesso. (fazer req e mandar para outra tela)',
            type: 'success',
          });
          return true;
        }

        this.$message({
          message: 'Existem campos não preenchidos ou inválidos ainda.',
          type: 'warning',
        });
        return false;
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped lang="scss">
.newAccountBtn {
  margin-bottom: 10px;
}
</style>
