// /plugins/logger.ts
export class Utils {
  formatArrayValue(arr: string[], delimiter: string = ', '): any {
    if (arr == null) {
      return ''
    }
    if (arr.length === 1) {
      return arr[0]
    } else {
      const value: string = arr.join(delimiter)
      return value
    }
  }

  timestampToTime(timestamp: any): any {
    try {
      const date = timestamp.toDate()
      const yyyy = `${date.getFullYear()}`
      // .slice(-2)で文字列中の末尾の2文字を取得する
      // `0${date.getHoge()}`.slice(-2) と書くことで０埋めをする
      const MM = `0${date.getMonth() + 1}`.slice(-2) // getMonth()の返り値は0が基点
      const dd = `0${date.getDate()}`.slice(-2)
      const HH = `0${date.getHours()}`.slice(-2)
      const mm = `0${date.getMinutes()}`.slice(-2)
      const ss = `0${date.getSeconds()}`.slice(-2)

      return `${yyyy}/${MM}/${dd} ${HH}:${mm}:${ss}`
    } catch (e) {
      return ''
    }
  }

  truncate(str: any, length: number): string {
    if (str && str['@id']) {
      return ''
    }
    str = String(str)
    return str.length <= length ? str : str.substring(0, length) + '...'
  }
}

export default (_: any, inject: any) => {
  inject('utils', new Utils())
}
