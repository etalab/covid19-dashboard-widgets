<template>

  <div class="l_col fr-col-12 fr-col-lg-3">
        
        <br>
        <br> <br>
        <br>
        
        <div class="scale" v-if="map">
          <p class="l_box_title fr-text--xs fr-mb-1w">Légende</p>
          <div class="scale_container"></div>
          <div>
            <span class="min fr-text--sm fr-text--bold fr-mb-0">{{convertNumberToHuman(min)}}</span>
            <span class="max fr-text--sm fr-text--bold fr-mb-0">{{convertNumberToHuman(max)}}</span>
          </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'LeftCol',

  data(){
    return {
      isDown:[false,false],
      isGreen:[false,false],
      isRed:[false,false],
      isBlue:[false,false]
    }
  },
  props: {
    date: String,
    localisation: String,
    values: Array,
    names: Array,
    evolcodes: Array,
    evolvalues : Array,
    min: Number,
    max: Number,
    map: Boolean
  },
  computed: {

  },
  methods: {

    convertNumberToHuman(float){
      return parseFloat(float).toLocaleString()
    },

    testEvolStyle(){
      var self = this
      this.names.forEach(function(n,i){
        if(self.evolcodes[i]=="green"){
          self.isGreen[i] = true
          self.isRed[i] = false
          self.isBlue[i] = false
          self.evolvalues[i] > 0 ? self.isDown[i] = false : self.isDown[i] = true
        }else if(self.evolcodes[i]=="red"){
          self.isGreen[i] = false
          self.isRed[i] = true
          self.isBlue[i] = false
          self.evolvalues[i] > 0 ? self.isDown[i] = false : self.isDown[i] = true
        }else{
          self.isGreen[i] = false
          self.isRed[i] = false
          self.isBlue[i] = true
          self.isDown[i] = false
        }
      })
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
    this.testEvolStyle()
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  /* overload fonts path, to delete when parent has access */
  @import "../../public/css/overload-fonts.css";
  @import "../../public/css/dsfr.min.css";

  .l_col{

    .sep, .sep-viz {
      border-bottom:1px solid #E5E5E5;
    }

    @media (min-width: 62em) {
      .sep-viz {
        display: none;
      }
    }

    .l_box_title{
      color: #6b6b6b;
    }
    .flex{
      display: inline-flex;
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
          background-color: #d9ffeb;
          .trend_ico {
            path {
              fill: #357941;
            }
          }
        }
        &.red {
          color: #d80600;
          background-color: #fff4f3;
          .trend_ico {
            path {
              fill: #d80600;
            }
          }
        }
        &.blue {
          color: #0768d5;
          background-color: #f0f7ff;
          .trend_ico {
            path {
              fill: #0768d5;
            }
          }
        }
      } 
    }
    .scale{
      .scale_container{
        height: 1.5rem;
        background-color: red;
        background: linear-gradient(90deg, rgba(255, 199, 0,1) 0%, rgba(113, 88, 69, 1) 100%);
      }
      div:last-child {
        display:flex;
        justify-content: space-between;
      }
    }

    @media (min-width: 36em) {
      .l_box_number_container {
        display: block;
        justify-content: unset;
      }
    }
  }


</style>
