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
          <div class="promotion-drugstore"> {{ p.authorName }} </div>
        </div>
        <div class="promotion-more-details">
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
        <el-form-item label="Preço" prop="value">
          <el-input v-model="promotionForm.value" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Site" prop="location">
          <el-input v-model="promotionForm.location" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Produto" prop="product_id" class="field-with-select">
          <el-select v-model="promotionForm.product_id">
            <el-option
              v-for="product in products"
              :key="product.value"
              :label="product.label"
              :value="product.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Início" prop="start" class="field-with-select" style="width: 48%; float: left; margin-bottom: 35px;">
          <el-date-picker type="date" format="dd/MM/yyyy" v-model="promotionForm.start" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="Fim" prop="end" class="field-with-select" style="width: 48%; float: right; margin-bottom: 35px;">
          <el-date-picker type="date" format="dd/MM/yyyy" v-model="promotionForm.end" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">Cancelar</el-button>
        <el-button type="primary" @click="submitForm">Cadastrar</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Denunciar promoção" :fullscreen="true" :visible.sync="dialogReportPromotionVisible" @close="resetFormReport">
      <el-form :model="reportPromotionForm" :rules="reportPromotionFormRules" ref="reportPromotionForm" label-position="top">
        <el-form-item label="Qual o motivo da denúncia?" prop="comment">
          <el-input type="textarea" :rows="4" v-model="reportPromotionForm.comment"></el-input>
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
import requester from '@/requester';

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
        value: '',
        location: '',
        product_id: '',
        start: '',
        end: '',
      },
      reportPromotionForm: {
        comment: '',
        promotion_id: '',
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
        location: [
          { required: true, message: 'Por favor digite o link do site', trigger: 'blur' },
        ],
        product: [
          { required: true, message: 'Por favor selecione um produto', trigger: 'change' }
        ],
        start: [
          { type: 'date', required: true, message: 'Por favor escolha uma data de início', trigger: 'change' }
        ],
        end: [
          { type: 'date', required: true, message: 'Por favor escolha uma data de fim', trigger: 'change' }
        ],
      },
      reportPromotionFormRules: {
        comment: [
          { required: true, message: 'Por favor digite o motivo', trigger: 'blur' },
        ],
      },
      promotions: [/*{
        id: Math.floor(Math.random() * 9999) + 1,
        name: 'Dipirona Monoidratada',
        image: 'https://static.ultrafarma.com.br//media/imagens_produtos/800px/00/000/60/6/00066092.jpg',
        price: 49.9,
        location: 'Drogasil',
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
        location: 'Poupafarma',
        authorName: 'Lucas Almeida',
        likesCount: 22,
        reportedByUser: true,
        likedByUser: true,
        createdAt: 1550628318039,
      }*/],
      filteredPromotions: [],
      products: [],
    };
  },
  created() {
    requester({
      url: '/products',
      headers: {
        Authorization: `Bearer ${this.$store.state.userData.token}`,
      }
    })
      .then(({ data }) => {
        this.products = data.data.map(p => Object.assign({}, { label: p.name, value: p.id }));
      });

    this.feedPromotions();
  },
  methods: {
    feedPromotions() {
      this.isLoading = true;

      requester({
        url: '/promotions',
        headers: {
          Authorization: `Bearer ${this.$store.state.userData.token}`,
        }
      })
        .then(({ data }) => {
          this.isLoading = false;

          this.promotions = data.data.map(p => Object.assign({}, p, {
            image: p.products.image,
            price: p.value,
            authorName: p.users.name,
            likesCount: p.likes.length,
            reportedByUser: true, // sempre true
            likedByUser: p.likes.some(l => l == this.$store.state.userData.id),
            createdAt: new Date(p.start).getTime(),
          }));

          this.orderTypeSelected();
        });
    },
    sendLike(id, index) {
      if (!this.isLoggedIn) return false;

      let request;

      if (!this.filteredPromotions[index].likedByUser) {
        request = requester({
          method: 'POST',
          url: `/promotions/${id}/like`,
          headers: {
            Authorization: `Bearer ${this.$store.state.userData.token}`,
          },
          data: {
            user_id: this.$store.state.userData.id,
          },
        });
      } else {
        request = requester({
          method: 'POST',
          url: `/promotions/${id}/unlike`,
          headers: {
            Authorization: `Bearer ${this.$store.state.userData.token}`,
          },
          data: {
            user_id: this.$store.state.userData.id,
          },
        });
      }

      request
        .then(({ data }) => {
          this.filteredPromotions[index].likedByUser = !this.filteredPromotions[index].likedByUser;

          if (this.filteredPromotions[index].likedByUser) {
            this.filteredPromotions[index].likesCount++;
          } else {
            this.filteredPromotions[index].likesCount--;
          }
        });

    },
    sendReport(id, index) {
      if (!this.isLoggedIn) return false;

      this.reportPromotionForm.promotion_id = id;

      this.dialogReportPromotionVisible = true;
    },
    openPromotionDialog() {
      this.dialogAddPromotionVisible = true;
    },
    submitForm() {
      this.$refs['promotionForm'].validate((valid) => {
        if (valid) {
          const body = Object.assign({}, this.promotionForm, {
            start: new Date(this.promotionForm.start).toISOString().slice(0, 19).replace('T', ' '),
            end: new Date(this.promotionForm.end).toISOString().slice(0, 19).replace('T', ' '),
            user_id: this.$store.state.userData.id,
            status: 1,
          });

          requester({
            method: 'POST',
            url: '/promotions',
            headers: {
              Authorization: `Bearer ${this.$store.state.userData.token}`,
            },
            data: body,
          })
            .then(({ data }) => {
              this.feedPromotions();

              this.$message({
                message: 'Promoção cadastrada com sucesso.',
                type: 'success',
              });

              this.resetForm();
            });

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
          const body = Object.assign({}, this.reportPromotionForm, {
            user_id: this.$store.state.userData.id,
          });

          requester({
            method: 'POST',
            url: `/promotions/${this.reportPromotionForm.promotion_id}/report`,
            headers: {
              Authorization: `Bearer ${this.$store.state.userData.token}`,
            },
            data: body,
          })
            .then(() => {
              this.$message({
                message: 'Denúncia enviada com sucesso.',
                type: 'success',
              });

              this.resetFormReport();
            });

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
        this.filteredPromotions = this.filteredPromotions.filter(p => (p.name.toLowerCase().indexOf(text) !== -1 || p.location.toLowerCase().indexOf(text) !== -1 || p.authorName.toLowerCase().indexOf(text) !== -1));
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
#promotion-list-container {
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
