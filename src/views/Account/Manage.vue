<template>
  <div id="account-manage-container">
    <el-form
      :model="ruleForm2"
      status-icon
      :rules="rules2"
      ref="ruleForm2"
      label-width="120px"
      class="demo-ruleForm"
      label-position="top"
    >
      <el-form-item label="Nome completo" prop="name">
        <el-input v-model="ruleForm2.name"></el-input>
      </el-form-item>
      <el-form-item prop="email" label="Email">
        <el-input v-model="ruleForm2.email"></el-input>
      </el-form-item>
      <el-form-item label="Senha" prop="pass">
        <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Confirmação de senha" prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <br />
      <el-form-item class="buttons-control">
        <el-button @click="resetForm('ruleForm2')">Cancelar</el-button>
        <el-button type="primary" @click="submitForm('ruleForm2')">Cadastrar</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import requester from '@/requester';

export default {
  name: 'AccountManage',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Por favor digite uma senha'));
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Por favor digite a senha novamente'));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('As duas senhas não são iguais'));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {
        pass: '',
        checkPass: '',
        name: '',
        email: '',
      },
      rules2: {
        name: [
          { required: true, message: 'Por favor digite seu nome', trigger: 'blur' },
        ],
        email: [
          { required: true, message: 'Por favor digite seu email', trigger: 'blur' },
          { type: 'email', message: 'Endereço de email inválido', trigger: ['blur', 'change'] },
        ],
        pass: [
          { required: true, message: 'Por favor digite uma senha', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' },
        ],
        checkPass: [
          { required: true, message: 'Por favor digite a senha novamente', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    if (this.$store.state.isLoggedIn) {
      this.ruleForm2.name = this.$store.state.userData.name;
      this.ruleForm2.email = this.$store.state.userData.email;
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.$store.state.isLoggedIn) {
            requester.post('/register', {
              name: this.ruleForm2.name,
              email: this.ruleForm2.email,
              password: this.ruleForm2.pass,
              c_password: this.ruleForm2.checkPass,
            })
            .then(({ data }) => {
              this.$store.dispatch('setUserData', {
                email: this.ruleForm2.email,
                name: data.data.name,
                token: data.data.token,
              });

              this.$message({
                message: 'Cadastro realizado com sucesso.',
                type: 'success',
              });

              this.resetForm(formName);

              this.$router.push({
                name: 'PromotionList',
              });
            });
          }

          return true;
        }

        this.$message({
          message: 'Campos não preenchidos ou inválidos.',
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
.buttons-control {
  text-align: right;
}
</style>
