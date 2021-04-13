import API from '../../api'
const simReports = require('./report.json')

class DupReportService {
  getSimilarityRecords = (userId) => {
    // const foundReports = simReports.map(item => ({
    //   ...item,
    //   sim_score: parseFloat(item['sim_score']).toFixed(3)
    // }))
    // return Promise.resolve(foundReports)
    // return API.get(`https://alb.topdup.org/api/v1/similarity-reports?userId=`)
    //   .then(result => result.data.map(item => ({
    //     ...item,
    //     sim_score: parseFloat(item['sim_score']).toFixed(3)
    //   })))
    return API.get(`/api/v1/similarity-reports?userId=${userId || ''}`)
      .then(result => result.data.map(item => ({
        ...item,
        sim_score: parseFloat(item['sim_score']).toFixed(3)
      })))
  }

  applyVote = (simReport, votedOption, userId) => {
    const simReportId = simReport.id
    const apiUrl = `api/v1/similarity-reports/${simReportId}/vote`
    return API.post(apiUrl, { votedOption, simReport, userId })
  }
}

export default DupReportService
