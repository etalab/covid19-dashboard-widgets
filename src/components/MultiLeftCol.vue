<template>

  <div class="l_col fr-col-12 fr-col-md-4 fr-col-lg-3">

        <div data-box="loc">
          <p class="l_box_title fr-text--xs fr-mb-1w">Localisation</p>
          <p class="l_box_label fr-text--sm fr-text--bold fr-my-0">
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M12.243 2.424c2.343 2.343 2.343 6.142 0 8.485L8 15.152l-4.243-4.243c-2.343-2.343-2.343-6.142 0-8.485C6.101.081 9.9.081 12.243 2.424zM4.7 3.367c-1.822 1.822-1.822 4.777 0 6.6l3.3 3.3 3.3-3.3c1.822-1.823 1.822-4.778 0-6.6-1.823-1.822-4.777-1.822-6.6 0zM8 5.333c.736 0 1.333.597 1.333 1.334C9.333 7.403 8.736 8 8 8s-1.333-.597-1.333-1.333c0-.737.597-1.334 1.333-1.334z" transform="translate(-550 -5417) translate(527 5237) translate(0 124) translate(23 56)"/></svg>
            <span class="fr-ml-1v">{{localisation}}</span>
          </p>
        </div>
        <div class="sep fr-my-3w"></div>
        <div data-box="number">

          <p class="l_box_title fr-text--xs fr-mb-1w">Mise à jour : {{date}}</p>

          <p class="fr-text--sm fr-text--bold fr-mt-0 fr-mb-1w">{{names[0]}}</p>

          <div class="l_box_number_container">
            <p class="fr-text--lg fr-text--bold fr-m-0">{{convertNumberToHuman(values[0])}}</p>
            <p class="l_box_trend l_box_label fr-m-0 fr-text--xs fr-text--bold" v-bind:class="{'down':isDown,'green':isGreen,'red':isRed,'blue':isBlue}">
              <svg class="trend_ico" width="24" height="24" viewBox="0 0 24 24">
                <path v-if="!isBlue" d="M19.071 4.929c3.903 3.903 3.903 10.239 0 14.142-3.903 3.903-10.239 3.903-14.142 0-3.903-3.903-3.903-10.239 0-14.142 3.903-3.903 10.239-3.903 14.142 0zm-2.828 2.828H7.757l3.182 3.182-4.242 4.243 2.121 2.121 4.243-4.242 3.182 3.182V7.757z" transform="translate(-902 -5664) translate(902 5664)"/>
                <path v-if="isBlue" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm4 11H8v2h8v-2zm0-4H8v2h8V9z" transform="translate(-1366 -5645) translate(1366 5645)"/>
              </svg>
              <span class="fr-ml-1v">{{convertNumberToHuman(evolvalues[0])}} % en 7j</span>
            </p>
          </div>

          <p class="fr-text--sm fr-text--bold fr-mt-0 fr-mb-1w">{{names[1]}}</p>

          <div class="l_box_number_container">
            <p class="fr-text--lg fr-text--bold fr-m-0">{{convertNumberToHuman(values[1])}}</p>
            <p class="l_box_trend l_box_label fr-m-0 fr-text--xs fr-text--bold" v-bind:class="{'down':isDown2,'green':isGreen2,'red':isRed2,'blue':isBlue2}">
              <svg class="trend_ico" width="24" height="24" viewBox="0 0 24 24">
                <path v-if="!isBlue2" d="M19.071 4.929c3.903 3.903 3.903 10.239 0 14.142-3.903 3.903-10.239 3.903-14.142 0-3.903-3.903-3.903-10.239 0-14.142 3.903-3.903 10.239-3.903 14.142 0zm-2.828 2.828H7.757l3.182 3.182-4.242 4.243 2.121 2.121 4.243-4.242 3.182 3.182V7.757z" transform="translate(-902 -5664) translate(902 5664)"/>
                <path v-if="isBlue2" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm4 11H8v2h8v-2zm0-4H8v2h8V9z" transform="translate(-1366 -5645) translate(1366 5645)"/>
              </svg>
              <span class="fr-ml-1v">{{convertNumberToHuman(evolvalues[1])}} % en 7j</span>
            </p>
          </div>

        </div>
    </div>
</template>

<script>

export default {
  name: 'MultiLeftCol',

  data(){
    return {
      isDown:false,
      isGreen:false,
      isRed:false,
      isBlue:false,
      isDown2:false,
      isGreen2:false,
      isRed2:false,
      isBlue2:false
    }
  },
  props: {
    date: String,
    localisation: String,
    values: Array,
    names: Array,
    evolcodes: Array,
    evolvalues : Array,
  },
  computed: {

  },
  methods: {

    convertNumberToHuman(float){
      return parseFloat(float).toLocaleString()
    },

    testEvolStyle(){

      if(this.evolcodes[0]=="green"){
        this.isGreen = true
        this.isRed = false
        this.isBlue = false
        this.evolvalues[0] > 0 ? this.isDown = false : this.isDown = true
      }else if(this.evolcodes[0]=="red"){
        this.isGreen = false
        this.isRed = true
        this.isBlue = false
        this.evolvalue[0] > 0 ? this.isDown = false : this.isDown = true
      }else{
        this.isGreen = false
        this.isRed = false
        this.isBlue = true
        this.isDown = false
      }

      if(this.evolcodes[1]=="green"){
        this.isGreen2 = true
        this.isRed2 = false
        this.isBlue2 = false
        this.evolvalues[1] > 0 ? this.isDown2 = false : this.isDown2 = true
      }else if(this.evolcodes[1]=="red"){
        this.isGreen2 = false
        this.isRed2 = true
        this.isBlue2 = false
        this.evolvalues[1] > 0 ? this.isDown2 = false : this.isDown2 = true
      }else{
        this.isGreen2 = false
        this.isRed2 = false
        this.isBlue2 = true
        this.isDown2 = false
      }

    }

  },

  watch:{
    evolcodes:function(){
      this.testEvolStyle()
    },
    evolvalues:function(){
      this.testEvolStyle()
    }
  },

  created(){

    if(this.evolcodes[0]=="green"){
        this.isGreen = true
        this.isRed = false
        this.isBlue = false
        this.evolvalues[0] > 0 ? this.isDown = false : this.isDown = true
      }else if(this.evolcodes[0]=="red"){
        this.isGreen = false
        this.isRed = true
        this.isBlue = false
        this.evolvalue[0] > 0 ? this.isDown = false : this.isDown = true
      }else{
        this.isGreen = false
        this.isRed = false
        this.isBlue = true
        this.isDown = false
      }

      if(this.evolcodes[1]=="green"){
        this.isGreen2 = true
        this.isRed2 = false
        this.isBlue2 = false
        this.evolvalues[1] > 0 ? this.isDown2 = false : this.isDown2 = true
      }else if(this.evolcodes[1]=="red"){
        this.isGreen2 = false
        this.isRed2 = true
        this.isBlue2 = false
        this.evolvalues[1] > 0 ? this.isDown2 = false : this.isDown2 = true
      }else{
        this.isGreen2 = false
        this.isRed2 = false
        this.isBlue2 = true
        this.isDown2 = false
      }
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
      margin-bottom: 15px;
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
        &.blue {
          color: #0768d5;
          .trend_ico {
            path {
              fill: #0768d5;
            }
          }
        }
      }
    }
  }



</style>
