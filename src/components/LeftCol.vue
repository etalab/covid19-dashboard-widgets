<template>

  <div class="l_col fr-col-12 fr-col-lg-3">

        <div data-box="loc">
          <p class="l_box_title fr-text--xs fr-mb-1w">Localisation</p>
          <p class="flex fr-text--sm fr-text--bold fr-my-0">
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M12.243 2.424c2.343 2.343 2.343 6.142 0 8.485L8 15.152l-4.243-4.243c-2.343-2.343-2.343-6.142 0-8.485C6.101.081 9.9.081 12.243 2.424zM4.7 3.367c-1.822 1.822-1.822 4.777 0 6.6l3.3 3.3 3.3-3.3c1.822-1.823 1.822-4.778 0-6.6-1.823-1.822-4.777-1.822-6.6 0zM8 5.333c.736 0 1.333.597 1.333 1.334C9.333 7.403 8.736 8 8 8s-1.333-.597-1.333-1.333c0-.737.597-1.334 1.333-1.334z" transform="translate(-550 -5417) translate(527 5237) translate(0 124) translate(23 56)"/></svg>
            <span class="fr-ml-1v">{{props['localisation']}}</span>
          </p>
        </div>
        <div class="sep fr-my-4w fr-my-md-3w"></div>
        <div data-box="number">
          <p class="l_box_title fr-text--xs fr-mb-1w">Mise à jour : {{props['date']}}</p>

          <!-- <div class="indicateur_info" :class="i>0 ? 'fr-mt-2w' : ''" v-for="(n,i) in props['names']" :key="n" @click = "EmitEvent(i)" v-bind:style="{'opacity':props['opacity'][i]}"> -->
          <div class="indicateur_info" :class="i>0 ? 'fr-mt-2w' : ''" v-for="(n,i) in props['names']" :key="n">
            <div class="flex" >
              <!-- <span class="legende_dot" v-bind:style="{'background-color':props['colors_legend'][i], 'display':props['legendDisplay'][i]}"></span> -->
              <p class="fr-text--sm fr-text--bold fr-mt-0 fr-mb-1w">{{props['names'][i]}}</p>
            </div>
            <div class="l_box_number_container">
              <p class="fr-text--lg fr-text--bold fr-mb-1v">{{convertFloatToHuman(props['currentValues'][i])}} {{props['units'][i]}}</p>
              <p class="l_box_trend flex fr-mb-0 fr-text--xs fr-text--bold fr-px-1w fr-py-1v" v-bind:class="{'down':isDown[i], 'horizontal':isHorizontal[i], 'green':isGreen[i],'red':isRed[i],'blue':isBlue[i]}">
                <svg class="trend_ico" width="16" height="16" viewBox="0 0 24 24">
                  <path v-if="!isBlue[i]" d="M19.071 4.929c3.903 3.903 3.903 10.239 0 14.142-3.903 3.903-10.239 3.903-14.142 0-3.903-3.903-3.903-10.239 0-14.142 3.903-3.903 10.239-3.903 14.142 0zm-2.828 2.828H7.757l3.182 3.182-4.242 4.243 2.121 2.121 4.243-4.242 3.182 3.182V7.757z" transform="translate(-902 -5664) translate(902 5664)"/>
                  <path v-if="isBlue[i]" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm4 11H8v2h8v-2zm0-4H8v2h8V9z" transform="translate(-1366 -5645) translate(1366 5645)"/>
                </svg>
                <span class="fr-ml-1v">{{convertFloatToHuman(props['evolvalues'][i])}} % en 7j</span>
              </p>
            </div>
          </div>
        </div>

        <div v-if="props['isMap']" class="sep fr-my-4w fr-my-md-3w"></div>
        <div v-else class="sep-viz fr-my-4w fr-my-md-3w"></div>
        <div class="scale" v-if="props['isMap']">
          <p class="l_box_title fr-text--xs fr-mb-1w">Légende</p>
          <div v-if="props['trendType'] === 'normal' " class="scale_container_normal"></div>
          <div v-else class="scale_container_abnormal"></div>
          <div>
            <span class="min fr-text--sm fr-text--bold fr-mb-0">{{convertFloatToHuman(props['min'])}}</span>
            <span class="max fr-text--sm fr-text--bold fr-mb-0">{{convertFloatToHuman(props['max'])}}</span>
          </div>
        </div>
    </div>
</template>

<script>
import { mixin } from '@/utils.js'
export default {
  name: 'LeftCol',
  mixins: [mixin],
  data () {
    return {
      isDown: [],
      isHorizontal: [],
      isGreen: [],
      isRed: [],
      isBlue: []
    }
  },
  props: {
    props: Object
  },
  computed: {

  },
  methods: {
    testEvolStyle () {
      const self = this
      this.props.names.forEach(function (n, i) {
        if (self.props.evolcodes[i] === 'green') {
          self.isGreen[i] = true
          self.isRed[i] = false
          self.isBlue[i] = false
          self.props.evolvalues[i] > 0 ? self.isDown[i] = false : self.isDown[i] = true
          self.isHorizontal = false
        } else if (self.props.evolcodes[i] === 'red') {
          self.isGreen[i] = false
          self.isRed[i] = true
          self.isBlue[i] = false
          self.props.evolvalues[i] > 0 ? self.isDown[i] = false : self.isDown[i] = true
          self.isHorizontal = false
        } else {
          self.isGreen[i] = false
          self.isRed[i] = false
          self.isBlue[i] = true
          self.isDown[i] = false
          self.isHorizontal = true
        }
      })
    },
    EmitEvent (index) {
      this.$emit('EventShowLine', { index: index })
    }
  },

  watch: {
    props: {
      handler () {
        this.testEvolStyle()
      },
      deep: true
    }
  },

  created () {
    this.testEvolStyle()
  }

}
</script>

<style scoped lang="scss">
  @import "../../css/overload-fonts.css";
  @import "../../css/dsfr.min.css";
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
      .legende_dot{
        min-width: 0.7rem;
        width: 0.7rem;
        height: 0.7rem;
        border-radius: 50%;
        display: inline-block;
        margin-top: 0.4rem;
        align-items: left;
        margin-right: 0.1rem;
      }
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
        &.horizontal {
          .trend_ico {
            transform: rotate(45deg);
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
      .scale_container_normal{
        height: 1.5rem;
        background-color: red;
        background: linear-gradient(90deg, rgba(255, 199, 0,1) 0%, rgba(113, 88, 69, 1) 100%);
      }
      .scale_container_abnormal{
        height: 1.5rem;
        background-color: red;
        background: linear-gradient(90deg, rgba(113, 88, 69, 1) 0%, rgba(255, 199, 0,1) 100%);
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
