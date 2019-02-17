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
      <el-form-item>
        <el-button @click="resetForm('ruleForm2')">Cancelar</el-button>
        <el-button type="primary" @click="submitForm('ruleForm2')">Cadastrar</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
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
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            message: 'Cadastro realizado com sucesso. (fazer req e mandar para outra tela)',
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

<style scoped lang="scss"></style>
