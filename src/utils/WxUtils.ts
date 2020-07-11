import PageUtil from '@/utils/PageUtil'
import UniUtil from './UniUtil'
import AppConfig from '@/const/AppConfig'
import UserStore from '@/plugins/store/UserStore'
import PagePath from '@/const/PagePath'
import UserAPI from '@/api/UserAPI'
import ProviderType from '@/const/ProviderType'
import HintMsg from '@/const/HintMsg'
import UserPayResultVO from '@/model/user/UserPayResultVO'

export default class QQUtils {
  static subscribeAppMsg (tmplIds: string[]) {
    return new Promise((resolve, reject) => {
      qq.subscribeAppMsg({
        tmplIds: tmplIds,
        subscribe: true,
        success () {
          resolve()
        },
        fail (err) {
          reject(err)
        }
      })
    })
  }

  static createRewardedVideoAd () {
    return UniUtil.createRewardedVideoAd(AppConfig.qq_award_ad_id)
  }

  static createInterstitialAd () {
    return qq.createInterstitialAd({
      adUnitId: AppConfig.qq_insert_ad_id
    })
  }

  static payVipAPI () {
    UserAPI.payVipAPI(ProviderType.wx).then((res: any) => {
      wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.package,
        signType: 'MD5',
        paySign: res.data.paySign,
        success () {
          UserStore.getMineUserAction().then(() => {
            UniUtil.hint('开通会员成功')
            PageUtil.reLaunch(PagePath.userMine)
          })
        },
        fail () {
          UniUtil.error(HintMsg.vipOpenFailMsg)
        }
      })
    })
  }

  static async userPay (amount: number, payResult: UserPayResultVO): Promise<void> {
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        timeStamp: payResult.timeStamp,
        nonceStr: payResult.nonceStr,
        package: payResult.package,
        signType: 'MD5',
        paySign: payResult.paySign,
        success () {
          resolve()
        },
        fail (err) {
          reject(err)
        }
      })
    })
  }
}