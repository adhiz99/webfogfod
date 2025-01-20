const connectKudu = require("../../config/database.config");

exports.get_summary_list = async (payload) => {
  const {
    batas = '',
    offset = '',
    klasifikasi = '',
    nomor_dokumen = '',
    period_start = '', 
    period_end = ''
  } = payload
  
  let filter_limit = `LIMIT 25`
  let filter_offset = `OFFSET 0`
  let filter_nomor_dokumen = ``
  let filter_periode = ``
  let cte = `
  SELECT CAST(nomor_dokumen AS STRING) AS nomor_dokumen, ertim as tanggal_masuk, doc_classification as klasifikasi, rekomendasi, link_pfiles, link_report FROM t3_dashssc${process.env.DATABASE}.t_doc_webpooling_pajak
  union all
  SELECT CAST(nomor_dokumen AS STRING) AS nomor_dokumen, ertim as tanggal_masuk, doc_classification as klasifikasi, rekomendasi, link_pfiles, link_report FROM t3_dashssc${process.env.DATABASE}.t_doc_webpooling_konsesi
  union all
  SELECT CAST(nomor_dokumen AS STRING) AS nomor_dokumen, ertim as tanggal_masuk, doc_classification as klasifikasi, rekomendasi, link_pfiles, link_report FROM t3_dashssc${process.env.DATABASE}.t_doc_webpooling_pnbp
  union all
  SELECT CAST(nomor_dokumen AS STRING) AS nomor_dokumen, ertim as tanggal_masuk, doc_classification as klasifikasi, rekomendasi, link_pfiles, link_report FROM t3_dashssc${process.env.DATABASE}.t_doc_webpooling_padi
  `
  
  if (period_start && period_end) {
    filter_periode = `AND (tanggal_masuk BETWEEN '${period_start} 00:00:00.000000000' AND '${period_end} 23:59:59.999999999')`
  }

  if (batas) {
    filter_limit = `LIMIT ${batas}`
  }

  if (offset) {
    filter_offset = `OFFSET ${offset}`
  }

  if (klasifikasi) {
    if (klasifikasi.toLowerCase()=='padi umkm') {
      cte = `
        SELECT CAST(nomor_dokumen AS STRING) AS nomor_dokumen, ertim as tanggal_masuk, doc_classification as klasifikasi, rekomendasi, link_pfiles, link_report FROM t3_dashssc${process.env.DATABASE}.t_doc_webpooling_padi
      `
    } else if (['pnbp', 'konsesi', 'pajak'].includes(klasifikasi.toLowerCase())) {
      cte = `
        SELECT CAST(nomor_dokumen AS STRING) AS nomor_dokumen, ertim as tanggal_masuk, doc_classification as klasifikasi, rekomendasi, link_pfiles, link_report FROM t3_dashssc${process.env.DATABASE}.t_doc_webpooling_${klasifikasi}
      `
    } else {
      return { data: [] }
    }
  }

  if (nomor_dokumen) {
    filter_nomor_dokumen = `AND nomor_dokumen LIKE '%${nomor_dokumen}%'`
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
          ${filter_periode}
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