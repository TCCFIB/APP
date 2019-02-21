<template>
  <div id="promotion-list-container">
    <el-input placeholder="Filtrar promoção" @keyup.native="filterPromotionsByText" v-model="filterText">
      <i
        class="el-icon-close el-input__icon"
        slot="suffix"
        @click="emptyFilterText"
        v-show="filterText.length > 0">
      </i>
    </el-input>

    <div class="buttons-control">
      <div class="order-promotion">
        <el-select @change="orderTypeSelected" v-model="orderTypeSelectedModel">
          <el-option
            v-for="item in orderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="add-promotion">
        <el-button type="primary" :disabled="!isLoggedIn" @click="openPromotionDialog">
          <i class="fa pr-i fa-plus-circle"></i>&nbsp;
          Cadastrar
        </el-button>
      </div>
    </div>

    <div class="cards-wrapper" v-loading="isLoading">
      <el-card class="promotion-card" v-for="(p, index) in filteredPromotions" :key="p.id">
        <div class="promotion-image">
          <img :src="p.image" />
        </div>
        <div class="promotion-details">
          <div class="promotion-title"> {{ p.name }} </div>
          <div class="promotion-price"> {{ p.price | currency }} </div>
          <div class="promotion-drugstore"> {{ p.drugstoreName}} </div>
        </div>
        <div class="promotion-more-details">
          <div class="promotion-author"> {{ p.authorName }} </div>
          <div class="promotion-report" :class="{ 'active': p.reportedByUser }">
            <el-button type="text" @click="sendReport(p.id, index)">
              <i class="fas pr-i fa-exclamation-triangle"></i>
            </el-button>
          </div>
          <div class="promotion-like" :class="{ 'active': p.likedByUser }">
            <el-button type="text" @click="sendLike(p.id, index)">
              {{ p.likesCount }}
              <i class="fa pr-i fa-thumbs-up"></i>
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog title="Cadastrar promoção" :fullscreen="true" :visible.sync="dialogAddPromotionVisible" @close="resetForm">
      <el-form :model="promotionForm" :rules="promotionFormRules" ref="promotionForm" label-position="top">
        <el-form-item label="Nome do remédio" prop="name">
          <el-input v-model="promotionForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Preço" prop="price">
          <el-input v-model="promotionForm.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Farmácia" prop="drugstoreName">
          <el-input v-model="promotionForm.drugstoreName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">Cancelar</el-button>
        <el-button type="primary" @click="submitForm">Cadastrar</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Denunciar promoção" :fullscreen="true" :visible.sync="dialogReportPromotionVisible" @close="resetFormReport">
      <el-form :model="reportPromotionForm" :rules="reportPromotionFormRules" ref="reportPromotionForm" label-position="top">
        <el-form-item label="Qual o motivo da denúncia?" prop="whyReport">
          <el-input type="textarea" :rows="4" v-model="reportPromotionForm.whyReport"></el-input>
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
  name: 'PromotionList',
  data() {
    return {
      filterText: '',
      isLoading: false,
      isLoggedIn: this.$store.state.isLoggedIn,
      dialogAddPromotionVisible: false,
      dialogReportPromotionVisible: false,
      promotionForm: {
        name: '',
        price: '',
        drugstoreName: '',
      },
      reportPromotionForm: {
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
        {
          value: 'expensive',
          label: 'Mais caro',
        },
        {
          value: 'cheaper',
          label: 'Mais barato',
        },
      ],
      promotionFormRules: {
        name: [
          { required: true, message: 'Por favor digite o nome', trigger: 'blur' },
        ],
        price: [
          { required: true, message: 'Por favor digite o preço', trigger: 'blur' },
        ],
        drugstoreName: [
          { required: true, message: 'Por favor digite a farmácia', trigger: 'blur' },
        ],
      },
      reportPromotionFormRules: {
        whyReport: [
          { required: true, message: 'Por favor digite o motivo', trigger: 'blur' },
        ],
      },
      promotions: [{
        id: Math.floor(Math.random() * 9999) + 1,
        name: 'Dipirona Monoidratada',
        image: 'https://static.ultrafarma.com.br//media/imagens_produtos/800px/00/000/60/6/00066092.jpg',
        price: 49.9,
        drugstoreName: 'Drogasil',
        authorName: 'Helder Traci',
        likesCount: 8,
        reportedByUser: false,
        likedByUser: false,
        createdAt: 1451856110000,
      }, {
        id: Math.floor(Math.random() * 9999) + 1,
        name: 'Epocler',
        image: 'https://drogariaspacheco.vteximg.com.br/arquivos/ids/347893-400-400/epocler-abacaxi-6-flaconetes-10ml-cada-Pacheco-504793.jpg?v=636663964469870000',
        price: 7.25,
        drugstoreName: 'Poupafarma',
        authorName: 'Kassia Hayashi',
        likesCount: 22,
        reportedByUser: true,
        likedByUser: true,
        createdAt: 1550628318039,
      }],
      filteredPromotions: [],
    };
  },
  created() {
    this.orderTypeSelected();
  },
  methods: {
    sendLike(id, index) {
      if (!this.isLoggedIn) return false;

      this.filteredPromotions[index].likedByUser = !this.filteredPromotions[index].likedByUser;

      if (this.filteredPromotions[index].likedByUser) {
        this.filteredPromotions[index].likesCount++;
      } else {
        this.filteredPromotions[index].likesCount--;
      }
    },
    sendReport(id, index) {
      if (!this.isLoggedIn) return false;

      this.filteredPromotions[index].reportedByUser = !this.filteredPromotions[index].reportedByUser;

      this.dialogReportPromotionVisible = true;
    },
    openPromotionDialog() {
      this.dialogAddPromotionVisible = true;
    },
    submitForm() {
      this.$refs['promotionForm'].validate((valid) => {
        if (valid) {
          this.$message({
            message: 'Promoção cadastrada com sucesso.',
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
      this.$refs['reportPromotionForm'].validate((valid) => {
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
      this.$refs['promotionForm'].resetFields();
      this.dialogAddPromotionVisible = false;
    },
    resetFormReport() {
      this.$refs['reportPromotionForm'].resetFields();
      this.dialogReportPromotionVisible = false;
    },
    orderTypeSelected(selected) {
      const promotions = JSON.parse(JSON.stringify(this.promotions));

      if (selected === 'older') {
        this.filteredPromotions = promotions.sort((a, b) => a.createdAt - b.createdAt);
      } else if (selected === 'expensive') {
        this.filteredPromotions = promotions.sort((a, b) => b.price - a.price);
      } else if (selected === 'cheaper') {
        this.filteredPromotions = promotions.sort((a, b) => a.price - b.price);
      } else {
        // newer
        this.filteredPromotions = promotions.sort((a, b) => b.createdAt - a.createdAt);
      }
    },
    filterPromotionsByText(e) {
      const text = e.target.value.toLowerCase();

      if (text.length === 0) {
        this.orderTypeSelected(this.orderTypeSelectedModel);
      } else if (text.length > 2) {
        this.filteredPromotions = this.filteredPromotions.filter(p => (p.name.toLowerCase().indexOf(text) !== -1 || p.drugstoreName.toLowerCase().indexOf(text) !== -1 || p.authorName.toLowerCase().indexOf(text) !== -1));
      }
    },
    emptyFilterText() {
      this.filterText = '';
      this.filterPromotionsByText();
    },
  },
};
</script>

<style scoped lang="scss">
.cards-wrapper {
  margin: 15px 0;
  min-height: 400px;
}

.buttons-control {
  overflow: hidden;
  margin-top: 15px;

  .order-promotion {
    width: 50%;
    float: left;
  }

  .add-promotion {
    width: 50%;
    float: right;
    text-align: right;
  }
}


.promotion-card {
  margin-bottom: 15px;
  padding: 10px 0;
  height: 120px;
  overflow: hidden;

  .promotion-image {
    float: left;
    width: 30%;
    img {
      width: 100%;
      max-width: 87px;
    }
  }

  .promotion-details {
    float: right;
    text-align: left;
    width: 65%;

    .promotion-title {
      font-weight: 700;
    }

    .promotion-price {
      margin-top: 10px;
      font-weight: 700;
      font-size: 22px;
      color: #66bb6a;
    }

    .promotion-drugstore {
      font-size: 12px;
      margin-top: 7px;
    }
  }

  .promotion-more-details {
    float: left;
    width: 100%;
    overflow: hidden;

    .promotion-author {
      float: left;
      font-size: 14px;
      margin: 10px 0 0 10px;
    }

    .promotion-like {
      float: right;
      margin: 5px 5px 0 0;
      i {
        color: #909399;
      }
      &.active {
        i {
          color: #66bb6a;
        }
      }
    }

    .promotion-report {
      float: right;
      margin: 5px 10px 0 10px;
      i {
        color: #909399;
      }
      &.active {
        i {
          color: #ff7043;
        }
      }
    }
  }
}
</style>
