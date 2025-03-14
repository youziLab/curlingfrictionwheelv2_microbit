function 常量初始化 () {
    nezhaV2.setComboMotor(nezhaV2.MotorPostion.M1, nezhaV2.MotorPostion.M2)
    常量_舵机_上臂开角度 = 135
    常量_舵机_上臂关角度 = 45
    常量_推杆时间 = 500
    最大挡位速度 = 0
    缓启停步进时间ms = 10
    basic.showIcon(IconNames.Chessboard)
}
function 遥控控制 () {
    if (PlanetX_Basic.get_Attention_Value(PlanetX_Basic.value_level.Tri)) {
        最大挡位速度 = 100
        局部_内转标记 = 0
    } else if (PlanetX_Basic.get_Attention_Value(PlanetX_Basic.value_level.Squ)) {
        最大挡位速度 = 60
        局部_内转标记 = 0
    } else if (PlanetX_Basic.get_Attention_Value(PlanetX_Basic.value_level.Cir)) {
        最大挡位速度 = 80
        局部_内转标记 = 0
    } else {
        if (局部_内转标记 == 0) {
            if (最大挡位速度 > 0) {
                最大挡位速度 = 0
            }
        }
    }
    if (PlanetX_Basic.get_Attention_Value(PlanetX_Basic.value_level.X)) {
        if (最大挡位速度 > 0 || 局部_内转标记 == 0) {
            最大挡位速度 = -50
        }
        局部_内转标记 = 1
    }
    if (最大挡位速度 != 缓慢启停速度) {
        if (Math.abs(最大挡位速度 - 缓慢启停速度) < 10) {
            缓慢启停速度 = 最大挡位速度
        }
        if (control.millis() - 缓启停时间标志位 > 缓启停步进时间ms) {
            缓启停时间标志位 = control.millis()
            if (Math.abs(缓慢启停速度) < 3) {
                if (最大挡位速度 > 缓慢启停速度) {
                    缓慢启停速度 += 1
                } else {
                    缓慢启停速度 += -1
                }
            } else {
                if (最大挡位速度 > 缓慢启停速度) {
                    缓慢启停速度 += 3
                } else {
                    缓慢启停速度 += -3
                }
            }
        }
        nezhaV2.start(nezhaV2.MotorPostion.M3, 缓慢启停速度 * -1)
        nezhaV2.start(nezhaV2.MotorPostion.M4, 缓慢启停速度 * 1)
    }
}
function 启动初始化 () {
    basic.showIcon(IconNames.Yes)
}
// 运动模型正解:已知小车线速度、角速度 计算 左右轮的线速度
// 公式：vl = v+w*l/2
// ​          vr = v-w*l/2
// V线速度，向前正数
// w角速度，右转正数
// 
// 为了灵敏度W统一扩大一定倍数
// 轴距0.13M
function 速度解算 (v: number, w: number) {
    速度解算局部_v1 = (v - 0.13 * w * 10) * -1
    速度解算局部_v2 = (v + 0.13 * w * 10) * -1
    速度解算局部_MAX = 速度解算局部_v1
    if (速度解算局部_MAX < 速度解算局部_v2) {
        速度解算局部_MAX = 速度解算局部_v2
    }
    if (速度解算局部_MAX > 100) {
        nezhaV2.comboStart(速度解算局部_v1 / 速度解算局部_MAX * 100, 速度解算局部_v2 / 速度解算局部_MAX * 100)
    } else {
        nezhaV2.comboStart(速度解算局部_v1, 速度解算局部_v2)
    }
}
function 遥控移动 () {
    局部_RC_Y = Math.map(PlanetX_Basic.GetAnalogValue(PlanetX_Basic.value_A.LY), 0, 1023, -50, 50)
    局部_RC_X = Math.map(PlanetX_Basic.GetAnalogValue(PlanetX_Basic.value_A.RX), 0, 1023, -50, 50)
    if (Math.abs(局部_RC_X) <= 5) {
        局部_RC_X = 0
    }
    if (Math.abs(局部_RC_Y) <= 5) {
        局部_RC_Y = 0
    }
    速度解算(局部_RC_Y, 局部_RC_X)
}
let 局部_RC_X = 0
let 局部_RC_Y = 0
let 速度解算局部_MAX = 0
let 速度解算局部_v2 = 0
let 速度解算局部_v1 = 0
let 缓启停时间标志位 = 0
let 缓慢启停速度 = 0
let 局部_内转标记 = 0
let 缓启停步进时间ms = 0
let 最大挡位速度 = 0
let 常量_推杆时间 = 0
let 常量_舵机_上臂关角度 = 0
let 常量_舵机_上臂开角度 = 0
常量初始化()
启动初始化()
basic.forever(function () {
    遥控移动()
    遥控控制()
})
