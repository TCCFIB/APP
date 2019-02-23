<template>
  <div id="coupon-list-container">
    <el-input placeholder="Filtrar cupom" @keyup.native="filterCouponsByText" v-model="filterText">
      <i
        class="el-icon-close el-input__icon"
        slot="suffix"
        @click="emptyFilterText"
        v-show="filterText.length > 0">
      </i>
    </el-input>

    <div class="buttons-control">
      <div class="order-coupon">
        <el-select @change="orderTypeSelected" v-model="orderTypeSelectedModel">
          <el-option
            v-for="item in orderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="add-coupon">
        <el-button type="primary" :disabled="!isLoggedIn" @click="openCouponDialog">
          <i class="fa pr-i fa-plus-circle"></i>&nbsp;
          Cadastrar
        </el-button>
      </div>
    </div>

    <div class="cards-wrapper" v-loading="isLoading">
      <el-card class="coupon-card" v-for="p in filteredCoupons" :key="p.id">
        <div class="coupon-details">
          <div class="coupon-title"> {{ p.name }} </div>
          <div class="coupon-description"> {{ p.description }} </div>
          <div class="coupon-drugstore"> {{ p.authorName }} </div>
        </div>
      </el-card>
    </div>

    <el-dialog title="Cadastrar cupom" :fullscreen="true" :visible.sync="dialogAddCouponVisible" @close="resetForm">
      <el-form :model="couponForm" :rules="couponFormRules" ref="couponForm" label-position="top">
        <el-form-item label="Título" prop="name">
          <el-input v-model="couponForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Descrição" prop="description">
          <el-input type="textarea" :rows="4" v-model="couponForm.description"></el-input>
        </el-form-item>
        <el-form-item label="Site" prop="location">
          <el-input v-model="couponForm.location" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Início" prop="start" class="field-with-select" style="width: 48%; float: left; margin-bottom: 35px;">
          <el-date-picker type="date" format="dd/MM/yyyy" v-model="couponForm.start" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="Fim" prop="end" class="field-with-select" style="width: 48%; float: right; margin-bottom: 35px;">
          <el-date-picker type="date" format="dd/MM/yyyy" v-model="couponForm.end" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">Cancelar</el-button>
        <el-button type="primary" @click="submitForm">Cadastrar</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Denunciar cupom" :fullscreen="true" :visible.sync="dialogReportCouponVisible" @close="resetFormReport">
      <el-form :model="reportCouponForm" :rules="reportCouponFormRules" ref="reportCouponForm" label-position="top">
        <el-form-item label="Qual o motivo da denúncia?" prop="whyReport">
          <el-input type="textarea" :rows="4" v-model="reportCouponForm.whyReport"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetFormReport">Cancelar</el-button>
        <el-button type="primary" @click="submitFormReport">Denunciar</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CouponList',
  data() {
    return {
      filterText: '',
      isLoading: false,
      isLoggedIn: this.$store.state.isLoggedIn,
      dialogAddCouponVisible: false,
      dialogReportCouponVisible: false,
      couponForm: {
        name: '',
        description: '',
        location: '',
        start: '',
        end: '',
      },
      reportCouponForm: {
        whyReport: '',
      },
      orderTypeSelectedModel: 'newer',
      orderOptions: [
        {
          value: 'newer',
          label: 'Mais novo',
        },
        {
          value: 'older',
          label: 'Mais velho',
        },
      ],
      couponFormRules: {
        name: [
          { required: true, message: 'Por favor digite o título', trigger: 'blur' },
        ],
        description: [
          { required: true, message: 'Por favor digite a descrição', trigger: 'blur' },
        ],
        location: [
          { required: true, message: 'Por favor digite o link do site', trigger: 'blur' },
        ],
        start: [
          { type: 'date', required: true, message: 'Por favor escolha uma data de início', trigger: 'change' }
        ],
        end: [
          { type: 'date', required: true, message: 'Por favor escolha uma data de fim', trigger: 'change' }
        ],
      },
      reportCouponFormRules: {
        whyReport: [
          { required: true, message: 'Por favor digite o motivo', trigger: 'blur' },
        ],
      },
      coupons: [{
        id: Math.floor(Math.random() * 9999) + 1,
        name: 'Vitamina C',
        description: 'Desconto de 10% em todos os produtos de vitamina C.',
        location: '',
        createdAt: 1451856110600,
      }, {
        id: Math.floor(Math.random() * 9999) + 1,
        name: 'Perfumaria',
        description: 'Frete grátis nas compras à cima de R$200,00.',
        location: '',
        createdAt: 1451856110700,
      }, {
        id: Math.floor(Math.random() * 9999) + 1,
        name: 'Higiene Pessoal',
        description: 'Leve 3 e pague 2 em todos os cremes dentais.',
        location: '',
        createdAt: 1451856110000,
      }],
      filteredCoupons: [],
    };
  },
  created() {
    this.orderTypeSelected();
  },
  methods: {
    sendLike(id, index) {
      if (!this.isLoggedIn) return false;

      this.filteredCoupons[index].likedByUser = !this.filteredCoupons[index].likedByUser;

      if (this.filteredCoupons[index].likedByUser) {
        this.filteredCoupons[index].likesCount++;
      } else {
        this.filteredCoupons[index].likesCount--;
      }
    },
    sendReport(id, index) {
      if (!this.isLoggedIn) return false;

      this.filteredCoupons[index].reportedByUser = !this.filteredCoupons[index].reportedByUser;

      this.dialogReportCouponVisible = true;
    },
    openCouponDialog() {
      this.dialogAddCouponVisible = true;
    },
    submitForm() {
      this.$refs['couponForm'].validate((valid) => {
        if (valid) {
          this.$message({
            message: 'Cupom cadastrado com sucesso.',
            type: 'success',
          });

          this.resetForm();
          return true;
        }

        this.$message({
          message: 'Campos não preenchidos ou inválidos.',
          type: 'warning',
        });
        return false;
      });
    },
    submitFormReport() {
      this.$refs['reportCouponForm'].validate((valid) => {
        if (valid) {
          this.$message({
            message: 'Denúncia enviada com sucesso.',
            type: 'success',
          });

          this.resetFormReport();
          return true;
        }

        this.$message({
          message: 'Campos não preenchidos ou inválidos.',
          type: 'warning',
        });
        return false;
      });
    },
    resetForm() {
      this.$refs['couponForm'].resetFields();
      this.dialogAddCouponVisible = false;
    },
    resetFormReport() {
      this.$refs['reportCouponForm'].resetFields();
      this.dialogReportCouponVisible = false;
    },
    orderTypeSelected(selected) {
      const coupons = JSON.parse(JSON.stringify(this.coupons));

      if (selected === 'older') {
        this.filteredCoupons = coupons.sort((a, b) => a.createdAt - b.createdAt);
      } else {
        this.filteredCoupons = coupons.sort((a, b) => b.createdAt - a.createdAt);
      }
    },
    filterCouponsByText(e) {
      const text = e.target.value.toLowerCase();

      if (text.length === 0) {
        this.orderTypeSelected(this.orderTypeSelectedModel);
      } else if (text.length > 2) {
        this.filteredCoupons = this.filteredCoupons.filter(p => (p.name.toLowerCase().indexOf(text) !== -1 || p.description.toLowerCase().indexOf(text) !== -1));
      }
    },
    emptyFilterText() {
      this.filterText = '';
      this.filterPromotionsByText({ target: { value: '' } });
    },
  },
};
</script>

<style lang="scss">
#coupon-list-container {
  .cards-wrapper {
    margin: 15px 0;
    min-height: 400px;
  }

  .buttons-control {
    overflow: hidden;
    margin-top: 15px;

    .order-coupon {
      width: 50%;
      float: left;
    }

    .add-coupon {
      width: 50%;
      float: right;
      text-align: right;
    }
  }


  .coupon-card {
    margin-bottom: 15px;
    padding: 20px;

    .coupon-details {
      text-align: left;
      width: 100%;

      .coupon-title {
        font-weight: 700;
        font-size: 22px;
      }

      .coupon-description {
        margin-top: 10px;
        font-size: 18px;
        opacity: 0.6;
      }

      .coupon-drugstore {
        font-size: 12px;
        margin-top: 7px;
      }
    }
  }

  .field-with-select {
    .el-form-item__label {
      width: 100%;
    }

    .el-select {
      width: 100%;
    }
  }
}
</style>
