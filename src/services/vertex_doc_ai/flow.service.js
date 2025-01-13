const connectKudu = require("../../config/database.config");

exports.get_summary_list = async (payload) => {
  const {
    batas = '',
    offset = '',
    klasifikasi = '',
    nomor_dokumen = ''
  } = payload

  let filter_limit = `LIMIT 25`
  let filter_offset = `OFFSET 0`
  let filter_nomor_dokumen = ``
  let cte = `
    SELECT nomor_dokumen, ertim as tanggal_masuk, doc_classification as klasifikasi, rekomendasi, link_pfiles, link_report FROM t3_dashssc_dev.t_doc_webpooling_pajak
    union all
    SELECT nomor_dokumen, ertim as tanggal_masuk, doc_classification as klasifikasi, rekomendasi, link_pfiles, link_report FROM t3_dashssc_dev.t_doc_webpooling_konsesi
    union all
    SELECT nomor_dokumen, ertim as tanggal_masuk, doc_classification as klasifikasi, rekomendasi, link_pfiles, link_report FROM t3_dashssc_dev.t_doc_webpooling_pnbp
    union all
    SELECT nomor_dokumen, ertim as tanggal_masuk, doc_classification as klasifikasi, rekomendasi, link_pfiles, link_report FROM t3_dashssc_dev.t_doc_webpooling_padi
  `

  if (batas) {
    filter_limit = `LIMIT ${batas}`
  }

  if (offset) {
    filter_offset = `OFFSET ${offset}`
  }

  if (klasifikasi) {
    if (klasifikasi=='PADI UMKM') {
      cte = `
        SELECT nomor_dokumen, ertim as tanggal_masuk, doc_classification as klasifikasi, rekomendasi, link_pfiles, link_report FROM t3_dashssc_dev.t_doc_webpooling_padi
      `
    } else if (['pnbp', 'konsesi', 'pajak'].includes(klasifikasi.toLowerCase())) {
      cte = `
        SELECT nomor_dokumen, ertim as tanggal_masuk, doc_classification as klasifikasi, rekomendasi, link_pfiles, link_report FROM t3_dashssc_dev.t_doc_webpooling_${klasifikasi}
      `
    } else {
      return { data: null }
    }
  }

  if (nomor_dokumen) {
    filter_nomor_dokumen = `AND nomor_dokumen = ${nomor_dokumen}`
  }

    try {
        const kudu = await connectKudu();
        const query = `
          with x as (
              ${cte}
          )
          select *
          from x
          where 1=1
          ${filter_nomor_dokumen}
          order by tanggal_masuk desc
          ${filter_limit}
          ${filter_offset}
          ;
        `
        const data = await kudu.query(query);

        const dataWithParsedLinks = data.map(item => {
            // Modify the link_pfiles attribute
            return {
                ...item,
                link_pfiles: JSON.parse(item.link_pfiles)
            };
        });
        return { data: dataWithParsedLinks };
    } catch (error) {
        console.error('Error querying Kudu:', error);
        throw error;
    }
};