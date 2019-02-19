<template>
  <div id="promotion-list-container">
    <el-input placeholder="Filtrar promoção" v-model="filterText"></el-input>

    <div class="add-promotion">
      <el-button type="primary" :disabled="!isLoggedIn" @click="openPromotionDialog">
        <i class="fa pr-i fa-plus-circle"></i>&nbsp;
        Cadastrar
      </el-button>
    </div>

    <div class="cards-wrapper" v-loading="isLoading">
      <el-card class="promotion-card" v-for="(p, index) in promotions" :key="p.id">
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

    <el-dialog title="Cadastrar promoção" :fullscreen="true" :visible.sync="dialogAddPromotionVisible">
      <el-form :model="promotionForm" :rules="promotionFormRules" ref="promotionForm" label-position="top">
        <el-form-item label="Promotion name" prop="name">
          <el-input v-model="promotionForm.name" autocomplete="off"></el-input>
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
  name: 'PromotionList',
  data() {
    return {
      filterText: '',
      isLoading: false,
      isLoggedIn: true,
      dialogAddPromotionVisible: false,
      promotionForm: {
        name: '',
      },
      promotionFormRules: {
        name: [
          { required: true, message: 'Por favor digite o nome', trigger: 'blur' },
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
      }],
    };
  },
  methods: {
    sendLike(id, index) {
      this.promotions[index].likedByUser = !this.promotions[index].likedByUser;
    },
    sendReport(id, index) {
      this.promotions[index].reportedByUser = !this.promotions[index].reportedByUser;
    },
    openPromotionDialog() {
      this.dialogAddPromotionVisible = true;
    },
    submitForm() {
      this.$refs['promotionForm'].validate((valid) => {
        if (valid) {
          this.$message({
            message: 'Promoção cadastrada com sucesso. (fazer req e mandar para outra tela)',
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
    resetForm() {
      this.$refs['promotionForm'].resetFields();
      this.dialogAddPromotionVisible = false;
    },
  },
};
</script>

<style scoped lang="scss">
.cards-wrapper {
  margin: 15px 0;
  min-height: 400px;
}

.add-promotion {
  text-align: right;
  margin-top: 15px;
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
