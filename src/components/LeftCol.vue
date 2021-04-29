<template>

  <div class="l_col fr-col-12 fr-col-md-4 fr-col-lg-3">

        <div data-box="loc">
          <p class="l_box_title fr-text--xs fr-mb-1w">Localisation</p>
          <p class="l_box_label fr-text--sm fr-text--bold fr-my-0">
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M12.243 2.424c2.343 2.343 2.343 6.142 0 8.485L8 15.152l-4.243-4.243c-2.343-2.343-2.343-6.142 0-8.485C6.101.081 9.9.081 12.243 2.424zM4.7 3.367c-1.822 1.822-1.822 4.777 0 6.6l3.3 3.3 3.3-3.3c1.822-1.823 1.822-4.778 0-6.6-1.823-1.822-4.777-1.822-6.6 0zM8 5.333c.736 0 1.333.597 1.333 1.334C9.333 7.403 8.736 8 8 8s-1.333-.597-1.333-1.333c0-.737.597-1.334 1.333-1.334z" transform="translate(-550 -5417) translate(527 5237) translate(0 124) translate(23 56)"/></svg>
            <span class="fr-ml-1v">France entière</span>
          </p>
        </div>
        <div class="sep fr-my-3w"></div>
        <div data-box="number">
          <p class="l_box_title fr-text--xs fr-mb-1w">Mise à jour : {{date}}</p>
          <p class="fr-text--sm fr-text--bold fr-mt-0 fr-mb-1w">{{name}}</p>
          <div class="l_box_number_container">
            <p class="fr-text--lg fr-text--bold fr-m-0">{{convertNumberToHuman(value)}}</p>
            <p class="l_box_trend l_box_label fr-m-0 fr-text--xs fr-text--bold" v-bind:class="{'down':isDown,'green':isGreen,'red':isRed}">
              <svg class="trend_ico" width="16" height="16" viewBox="0 0 16 16"><path d="M12.714 3.286c2.602 2.602 2.602 6.826 0 9.428-2.602 2.602-6.826 2.602-9.428 0-2.602-2.602-2.602-6.826 0-9.428 2.602-2.602 6.826-2.602 9.428 0zm-1.886 1.886H5.172l2.12 2.12-2.828 2.83 1.415 1.414 2.828-2.829 2.121 2.121V5.172z" transform="translate(-663 -5576) translate(527 5237) translate(1 225) translate(135 114)"/></svg>
              <span class="fr-ml-1v">{{convertNumberToHuman(evolvalue)}} % en 7j</span>
            </p>
          </div>
        </div>
        <div class="sep fr-my-3w"></div>
        <div class="fr-mb-3w fr-mb-md-0" data-box="leg">
          <p class="l_box_title fr-text--xs fr-mb-1w">Légende</p>
          <div class="l_box_legende_container">
            <div class="legende_dot"></div>
            <span class="fr-text--sm fr-text--bold fr-ml-1v">{{capitalize(unit)}}</span>
          </div>
        </div>

    </div>
</template>

<script>

export default {
  name: 'LeftCol',

  data(){
    return {
      isDown:false,
      isGreen:false,
      isRed:false,
    }
  },
  props: {
    date: String,
    localisation: String,
    value: String,
    unit: String,
    name: String,
    evolcode: String,
    evolvalue : String
  },
  computed: {

  },
  methods: {

    convertNumberToHuman(float){
      return parseFloat(float).toLocaleString()
    },

    capitalize(string){
      return string.charAt(0).toUpperCase() + string.slice(1)
    },

    testEvolStyle(){
      if(this.evolcode=="green"){
        this.isGreen = true
        this.isRed = false
      }else{
        this.isGreen = false
        this.isRed = true
      }

      this.evolvalue > 0 ? this.isDown = false : this.isDown = true

    }

  },

  watch:{
    evolcode:function(){
      this.testEvolStyle()
    },
    evolvalue:function(){
      this.testEvolStyle()
    }
  },

  created(){
    this.evolcode === "green" ? this.isGreen = true : this.isRed = true
    this.evolvalue > 0 ? this.isDown = false : this.isDown = true
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  /* overload fonts path, to delete when parent has access */
  @import "../../css/overload-fonts.css";
  @import "../../css/dsfr.min.css";

  .l_col{

    .sep {
      border-bottom:1px solid #E5E5E5;
    }

    .l_box_title{
      color: #6b6b6b;
    }
    .l_box_label{
      display: flex;
      align-items: center;
    }
    .l_box_number_container {
      display: flex;
      justify-content: space-between;

      .l_box_trend {
        &.down {
          .trend_ico {
            transform: rotate(90deg);
          }
        }

        &.green {
          color: #357941;

          .trend_ico {
            path {
              fill: #357941;
            }
          }
        }

        &.red {
          color: #d80600;

          .trend_ico {
            path {
              fill: #d80600;
            }
          }
        }
      }
    }
    .legende_dot{
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: #000091;
      display: inline-block;
      transform:translate(0,3px);
    }
  }



</style>
