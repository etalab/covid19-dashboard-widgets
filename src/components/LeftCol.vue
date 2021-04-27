<template>

  <div class="l_col">
        
        <div class="l_box" data-box="loc">
          <span class="l_box_title">Localisation</span>
          <span class="l_box_label">
            <svg class="loc_ico" width="16" height="16" viewBox="0 0 16 16"><path d="M12.243 2.424c2.343 2.343 2.343 6.142 0 8.485L8 15.152l-4.243-4.243c-2.343-2.343-2.343-6.142 0-8.485C6.101.081 9.9.081 12.243 2.424zM4.7 3.367c-1.822 1.822-1.822 4.777 0 6.6l3.3 3.3 3.3-3.3c1.822-1.823 1.822-4.778 0-6.6-1.823-1.822-4.777-1.822-6.6 0zM8 5.333c.736 0 1.333.597 1.333 1.334C9.333 7.403 8.736 8 8 8s-1.333-.597-1.333-1.333c0-.737.597-1.334 1.333-1.334z" transform="translate(-550 -5417) translate(527 5237) translate(0 124) translate(23 56)"/></svg>
            France entière
          </span>
        </div>
        <div class="l_box" data-box="number">
          <span class="l_box_title">Mise à jour : {{date}}</span>
          <span class="l_box_label">{{name}}</span>
          <div class="l_box_number_container">
            <span class="l_box_number">{{convertNumberToHuman(value)}}</span>
            <span class="l_box_trend" v-bind:class="{'down':isDown,'green':isGreen,'red':isRed}">
              <svg class="trend_ico" width="16" height="16" viewBox="0 0 16 16"><path d="M12.714 3.286c2.602 2.602 2.602 6.826 0 9.428-2.602 2.602-6.826 2.602-9.428 0-2.602-2.602-2.602-6.826 0-9.428 2.602-2.602 6.826-2.602 9.428 0zm-1.886 1.886H5.172l2.12 2.12-2.828 2.83 1.415 1.414 2.828-2.829 2.121 2.121V5.172z" transform="translate(-663 -5576) translate(527 5237) translate(1 225) translate(135 114)"/></svg>
              {{convertNumberToHuman(evolvalue)}} % en 7j
            </span>
          </div>
        </div>
        <div class="l_box" data-box="leg">
          <span class="l_box_title">Légende</span>
          <div class="l_box_legende_container">
            <div class="legende_dot"></div>
            <span class="legende_txt">{{capitalize(unit)}}</span>
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

  .l_col{
      width: 33.33%;
      height: 100%;
      display: inline-block;
      overflow: hidden;
      padding-left: 25px;
      padding-right: 25px;
      box-sizing: border-box;
      .l_box{
        width: 100%;
        margin-top: 15px;
        border-bottom: 1px solid #e5e5e5;
        padding-bottom: 25px;
        position: relative;
        .l_box_title{
          font-family: "Marianne";
          font-size: 12px;
          color:#6b6b6b;
          margin-bottom: 15px;
          display: block;
          position: relative;
        }
        .l_box_label{
          font-family: "Marianne";
          font-size: 14px;
          color:#242424;
          position: relative;
          .loc_ico{
            position: relative;
            transform:translate(0,2px);
          } 
        }
        .l_box_number_container{
          margin-top: 5px;
          .l_box_number{
            font-family: "Marianne";
            font-size: 20px;
            color:#161616;
            display: inline-block;
          }
          .l_box_trend{
            font-family: "Marianne";
            font-size: 12px;
            display: inline-block;
            margin-left: 10px;
            .trend_ico{
              position: relative;
              transform:translate(0,2px);
            }
            &.down{
              .trend_ico{
                transform:translate(0,2px) rotate(90deg);
              }
            }
            &.green{
              color:#357941;
              .trend_ico{
                path{
                  fill:#357941;
                }
              }
            }
            &.red{
              color:#d80600;
              .trend_ico{
                path{
                  fill:#d80600;
                }
              }
            }
          }
        }
        .l_box_legende_container{
          .legende_dot{
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: #000091;
            display: inline-block;
            transform:translate(0,3px);
          }
          .legende_txt{
            font-family: "Marianne";
            font-size: 14px;
            color:#242424;
            display: inline-block;
            margin-left: 5px;
          }
        }
        &:last-child{
          border-bottom: 0px;
          padding-bottom: 0px;
        }
      }
      &[data-display="small"]{
        width: 100%;
        display: block;
        height: 320px;
      }
    }

  
</style>
