const connectKudu = require("../../config/database.config");

exports.get_tfog_h_int = async (payload) => {
  const { keyword = '', period_start = '', period_end = '', limit = '', offset = '' } = payload

  let batas = `LIMIT 25`
  let offsets = `OFFSET 0`
  let periode = ``

  if (limit) {
    batas = `LIMIT ${limit}`
  }

  if (offset) {
    offsets = `OFFSET ${offset}`
  }

  if (period_start && period_end) {
    periode = `AND (arrive_date BETWEEN '${period_start}' AND '${period_end}')`
  }

    try {
        const kudu = await connectKudu();
        const query = `
          SELECT * FROM t3_mntrfog_dev.t_fog_h_int
          WHERE 1=1 AND
              (LOWER(no_pkk_inaportnet) LIKE LOWER('%${keyword}%') OR
              LOWER(no_pkk) LIKE LOWER('%${keyword}%') OR
              LOWER(vessel_name)  LIKE LOWER('%${keyword}%') OR
              LOWER(name_branch) LIKE LOWER('%${keyword}%') OR
              LOWER(name_organization) LIKE LOWER('%${keyword}%'))
              ${periode} ORDER BY no_pkk_inaportnet DESC
          ${batas}
          ${offsets}
          ;
          `
          console.log(query);
          
        const data = await kudu.query(query);
        
        return { data: data };
    } catch (error) {
        console.error('Error querying Kudu:', error);
        throw error;
    }
};

exports.get_tfog_d_init = async (payload) => {
  const { id_ppkb = '', limit = '', offset = '' } = payload

    let batas = `LIMIT 25`
    let offsets = `OFFSET 0`
    let id_ppkbs = ``

    if (limit) {
      batas = `LIMIT ${limit}`
    }

    if (offset) {
      offsets = `OFFSET ${offset}`
    }

    if (id_ppkb) {
      id_ppkbs = `AND id_ppkb = ${id_ppkb}`
    }

    try {
        const kudu = await connectKudu();
        const query = `
          SELECT * FROM t3_mntrfog_dev.t_fog_d_int
          WHERE 1=1 ${id_ppkbs} ORDER BY id_ppkb DESC
          ${batas}
          ${offsets}
          ;
          `
        const data = await kudu.query(query);
        
        return { data: data };
    } catch (error) {
        console.error('Error querying Kudu:', error);
        throw error;
    }
};

exports.get_tfod_int = async (payload) => {
  const { id_pkk = '', no_pmh = '', limit = '', offset = '' } = payload

  let batas = `LIMIT 25`
  let offsets = `OFFSET 0`
  let id_pkks = ``

  if (limit) {
    batas = `LIMIT ${limit}`
  }

  if (offset) {
    offsets = `OFFSET ${offset}`
  }

  if (id_pkk) {
    id_pkks = `AND id_pkk = ${id_pkk}`
  }

    try {
        const kudu = await connectKudu();
        const query = `
          SELECT * FROM t3_mntrfog_dev.t_fod_int
          WHERE 1=1
              AND LOWER(no_pmh) LIKE LOWER('%${no_pmh}%')
              ${id_pkks} ORDER BY id_pkk DESC
          ${batas}
          ${offsets}
          ;
          `
        const data = await kudu.query(query);
        
        return { data: data };
    } catch (error) {
        console.error('Error querying Kudu:', error);
        throw error;
    }
};