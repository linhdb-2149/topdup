import api from '../../api'

class DupCompareService {
  getSimilarityResults = (compareOption) => {
    const apiUrl = 'https://alb.topdup.org/api/v1/dup-compare/compare'
    return api.post(apiUrl, compareOption)
  }
}

export default DupCompareService