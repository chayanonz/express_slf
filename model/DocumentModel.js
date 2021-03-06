var sql = require('./BaseModel');

var Task = function (task) {
    this.task = task.task;
    this.status = task.status;
    this.created_at = new Date();
};
Task.getDateOpenUploadDocument = function getDateOpenUploadDocument(result) {
    //console.log(" = ", code);
    var str = "SELECT MIN(define_upload_date_start) AS min_date ,MAX(define_upload_date_end) AS max_date,semester_name"
        + " FROM tb_define_upload_date WHERE define_upload_date_status ='open';"
    // console.log(str);

    sql.query(str, function (err, res) {
        if (err) {
            const require = {
                error: err,
                require: false
            }
            console.log("error: ", err);
            result(null, require);
        }
        else {
            const require = {
                res: res,
                require: true
            };
            result(null, require);
        }
    });
};
Task.getTypeOfDocumentByCode = function getTypeOfDocumentByCode(result) {
    //console.log(" = ", code);
    var str = "SELECT * FROM `tb_type_of_document`"
    sql.query(str, function (err, res) {
        if (err) {
            const require = {
                error: err,
                require: false
            }
            console.log("error: ", err);
            result(null, require);
        }
        else {
            const require = {
                res: res,
                require: true
            };
            result(null, require);
        }
    });
};
Task.checkDocumentStatusByCode = function checkDocumentStatusByCode(code, result) {
    //console.log(" = ", code);

    ID = code.ID
    // type = code.num_type

    var str = "SELECT * FROM `tb_type_of_document`"
        + " LEFT JOIN tb_upload_document ON tb_type_of_document.type_of_document_id = tb_upload_document.type_of_document_id"
        + " ORDER BY tb_type_of_document.type_of_document_id"
    // console.log(str);

    sql.query(str, function (err, res) {
        if (err) {
            const require = {
                error: err,
                require: false
            }
            console.log("error: ", err);
            result(null, require);
        }
        else {
            const require = {
                res: res,
                require: true
            };
            result(null, require);
        }
    });
};
Task.getDocBycode = function getDocBycode(code, result) {
    //console.log(" = ", code);

    ID = code.ID
    type = code.type
    semester = code.semester
    var str = "SELECT * FROM `tb_document`"
        + " WHERE ID ='" + ID + "'"
        + " AND type_of_document_id ='" + type + "'"
        + " AND semester_name ='" + semester + "';"

    // console.log(str);

    sql.query(str, function (err, res) {
        if (err) {
            const require = {
                error: err,
                require: false
            }
            console.log("error: ", err);
            result(null, require);
        }
        else {
            const require = {
                res: res,
                require: true
            };
            result(null, require);
        }
    });
};

Task.CheckOldDoc = function CheckOldDoc(code) {
    //console.log(" = ", code);
    return new Promise(function (resolve, reject) {
        detail_doc = code.detail_doc
        semester_name = code.semester
        var str = "SELECT  Count(`type_of_document_id`) as checkdoc"
            + " FROM `tb_upload_document`"
            + " WHERE `ID` ='" + detail_doc[0].ID + "' AND `type_of_document_id` = '" + detail_doc[0].type_of_document + "'"
            + " AND `semester_name` ='" + semester_name + "';"

        // console.log(str);

        sql.query(str, function (err, res) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(res);
            }
        });
    })
};

Task.increaseOldDocument = function increaseOldDocument(code) {
    //console.log(" = ", code);

    return new Promise(function (resolve, reject) {
        date = code.date
        detail_doc = code.detail_doc
        name_doc = code.name_doc
        link_doc = code.link_doc
        semester = code.semester
        status = code.status
        if (status == 3) {
            var str = "UPDATE `tb_upload_document`"
                + " SET `add_date`='" + date + "'"
                + ",`upload_document_status`='รอตรวจสอบข้อมูล'"
                + ", `remark`=''"
                + " WHERE `ID` = '" + detail_doc[0].ID + "'"
                + " AND `student_id` ='" + detail_doc[0].student_id + "';"
        } else {
            var str = "UPDATE `tb_upload_document`"
                + " SET `add_date`='" + date + "'"
                + " WHERE `ID` = '" + detail_doc[0].ID + "'"
                + " AND `student_id` ='" + detail_doc[0].student_id + "';"
        }
        for (var i = 0; i < link_doc.length; i++) {
            str += "INSERT INTO `tb_document`(`ID`,"
                + " `upload_document_name`,"
                + " `upload_document_url`,"
                + " `type_of_document_id`,"
                + " `semester_name` ) "
                + " VALUES ( '"
                + detail_doc[0].ID + "','"
                + name_doc[i] + "','"
                + link_doc[i] + "','"
                + detail_doc[0].type_of_document + "','"
                + semester + "'"
                + " ) ; "
        }

        // console.log(str);

        sql.query(str, function (err, res) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(res);
            }
        });
    })
};

Task.insertNewDocument = function insertNewDocument(code) {
    return new Promise(function (resolve, reject) {
        //console.log(" = ", code);
        date = code.date
        detail_doc = code.detail_doc
        name_doc = code.name_doc
        link_doc = code.link_doc
        semester = code.semester
        var str = "INSERT INTO `tb_upload_document`(`ID`,"
            + " `student_id`,"
            + " `upload_document_status`,"
            + " `type_of_document_id`,"
            + " `add_date`,"
            + "`semester_name` ) "
            + " VALUES ( '"
            + detail_doc[0].ID + "','"
            + detail_doc[0].student_id + "','"
            + 'รอตรวจสอบข้อมูล' + "','"
            + detail_doc[0].type_of_document + "','"
            + date + "','"
            + semester + "'"
            + " ) ; ";

        for (var i = 0; i < link_doc.length; i++) {
            str += "INSERT INTO `tb_document`(`ID`,"
                + " `upload_document_name`,"
                + " `upload_document_url`,"
                + " `type_of_document_id` ,"
                + " `semester_name` ) "
                + " VALUES ( '"
                + detail_doc[0].ID + "','"
                + name_doc[i] + "','"
                + link_doc[i] + "','"
                + detail_doc[0].type_of_document + "','"
                + semester + "'"
                + " ) ; "
        }

        // console.log(str);

        sql.query(str, function (err, res) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(res);
            }
        });
    })
};
Task.DeleteDocumentByCode = function DeleteDocumentByCode(code, result) {
    //console.log(" = ", code);
    var str = "DELETE FROM `tb_document` WHERE `upload_document_url` = '" + code.uri + "'"
    // console.log(str);

    sql.query(str, function (err, res) {
        if (err) {
            const require = {
                error: err,
                require: false
            }
            console.log("error: ", err);
            result(null, require);
        }
        else {
            const require = {
                res: res,
                require: true
            };
            result(null, require);
        }
    });
};
Task.DeleteUpload = function DeleteUpload(code, result) {
    //console.log(" = ", code);

    ID = code.ID
    type = code.type
    semester = code.semester

    var str = "DELETE FROM `tb_upload_document` "
        + " WHERE `ID` ='" + ID + "' AND `type_of_document_id` ='" + type + "'"
        + " AND semester_name = '" + semester + "';"

    // console.log(str);

    sql.query(str, function (err, res) {
        if (err) {
            const require = {
                error: err,
                require: false
            }
            console.log("error: ", err);
            result(null, require);
        }
        else {
            const require = {
                res: res,
                require: true
            };
            result(null, require);
        }
    });
};

Task.checkpersonupload = function checkpersonupload(code, result) {
    //console.log(" = ", code);
    var str = "select tbname.`ID`,tb_upload_document.semester_name,"
        + " tbname.student_id,tbname.student_prefix ,tbname.student_name,"
        + " tbname.year,tbname.student_school_of,tbname.type_scholarship,tbsc.`school_of_name`,"
        + " sum(case when `type_of_document_id` = '1' and `upload_document_status` ='รอตรวจสอบข้อมูล' then 1"
        + " when `type_of_document_id` = '1' and `upload_document_status` ='ผ่านการอนุมัติ' then 2"
        + " when `type_of_document_id` = '1' and `upload_document_status` ='ไม่ผ่านการอนุมัติ' then 3"
        + " else 0 end) as doc1,"
        + " sum(case when `type_of_document_id` = '2' and `upload_document_status` ='รอตรวจสอบข้อมูล' then 1"
        + " when `type_of_document_id` = '2' and `upload_document_status` ='ผ่านการอนุมัติ' then 2"
        + " when `type_of_document_id` = '2' and `upload_document_status` ='ไม่ผ่านการอนุมัติ' then 3"
        + " else 0 end) as doc2,"
        + " sum(case when `type_of_document_id` = '3' and `upload_document_status` ='รอตรวจสอบข้อมูล' then 1"
        + " when `type_of_document_id` = '3' and `upload_document_status` ='ผ่านการอนุมัติ' then 2"
        + " when `type_of_document_id` = '3' and `upload_document_status` ='ไม่ผ่านการอนุมัติ' then 3"
        + " else 0 end) as doc3,"
        + " sum(case when `type_of_document_id` = '4' and `upload_document_status` ='รอตรวจสอบข้อมูล' then 1"
        + " when `type_of_document_id` = '4' and `upload_document_status` ='ผ่านการอนุมัติ' then 2"
        + " when `type_of_document_id` = '4' and `upload_document_status` ='ไม่ผ่านการอนุมัติ' then 3"
        + " else 0 end) as doc4,"
        + " sum(case when `type_of_document_id` = '5' and `upload_document_status` ='รอตรวจสอบข้อมูล' then 1"
        + " when `type_of_document_id` = '5' and `upload_document_status` ='ผ่านการอนุมัติ' then 2"
        + " when `type_of_document_id` = '5' and `upload_document_status` ='ไม่ผ่านการอนุมัติ' then 3"
        + " else 0 end) as doc5,"
        + " sum(case when `type_of_document_id` = '6' and `upload_document_status` ='รอตรวจสอบข้อมูล' then 1"
        + " when `type_of_document_id` = '6' and `upload_document_status` ='ผ่านการอนุมัติ' then 2"
        + " when `type_of_document_id` = '6' and `upload_document_status` ='ไม่ผ่านการอนุมัติ' then 3"
        + " else 0 end) as doc6,"
        + " sum(case when `type_of_document_id` = '7' and `upload_document_status` ='รอตรวจสอบข้อมูล' then 1"
        + " when `type_of_document_id` = '7' and `upload_document_status` ='ผ่านการอนุมัติ' then 2"
        + " when `type_of_document_id` = '7' and `upload_document_status` ='ไม่ผ่านการอนุมัติ' then 3"
        + " else 0 end) as doc7,"
        + " sum(case when `type_of_document_id` = '8' and `upload_document_status` ='รอตรวจสอบข้อมูล' then 1"
        + " when `type_of_document_id` = '8' and `upload_document_status` ='ผ่านการอนุมัติ' then 2"
        + " when `type_of_document_id` = '8' and `upload_document_status` ='ไม่ผ่านการอนุมัติ' then 3"
        + " else 0 end) as doc8,"
        + " sum(case when `type_of_document_id` = '9' and `upload_document_status` ='รอตรวจสอบข้อมูล' then 1"
        + " when `type_of_document_id` = '9' and `upload_document_status` ='ผ่านการอนุมัติ' then 2"
        + " when `type_of_document_id` = '9' and `upload_document_status` ='ไม่ผ่านการอนุมัติ' then 3"
        + " else 0 end) as doc9,"
        + " sum(case when `type_of_document_id` = '10' and `upload_document_status` ='รอตรวจสอบข้อมูล' then 1"
        + " when `type_of_document_id` = '10' and `upload_document_status` ='ผ่านการอนุมัติ' then 2"
        + " when `type_of_document_id` = '10' and `upload_document_status` ='ไม่ผ่านการอนุมัติ' then 3"
        + " else 0 end) as doc10,"
        + " sum(case when `type_of_document_id` = '11' and `upload_document_status` ='รอตรวจสอบข้อมูล' then 1"
        + " when `type_of_document_id` = '11' and `upload_document_status` ='ผ่านการอนุมัติ' then 2"
        + " when `type_of_document_id` = '11' and `upload_document_status` ='ไม่ผ่านการอนุมัติ' then 3"
        + " else 0 end) as doc11,"
        + " sum(case when `type_of_document_id` = '12' and `upload_document_status` ='รอตรวจสอบข้อมูล' then 1"
        + " when `type_of_document_id` = '12' and `upload_document_status` ='ผ่านการอนุมัติ' then 2"
        + " when `type_of_document_id` = '12' and `upload_document_status` ='ไม่ผ่านการอนุมัติ' then 3"
        + " else 0 end) as doc12,"
        + " sum(case when `type_of_document_id` = '13' and `upload_document_status` ='รอตรวจสอบข้อมูล' then 1"
        + " when `type_of_document_id` = '13' and `upload_document_status` ='ผ่านการอนุมัติ' then 2"
        + " when `type_of_document_id` = '13' and `upload_document_status` ='ไม่ผ่านการอนุมัติ' then 3"
        + " else 0 end) as doc13"
        + " from tb_upload_document"
        + " LEFT JOIN tb_student as tbname ON tbname.ID = tb_upload_document.ID"
        + " LEFT JOIN tb_school_of as tbsc ON tbsc.school_of_id  = tbname.student_school_of"
        + " WHERE tbname.`ID` LIKE '%" + code.ID + "%'"
        + " group by tb_upload_document.ID ,tb_upload_document.semester_name"
    // console.log(str);

    sql.query(str, function (err, res) {
        if (err) {
            const require = {
                error: err,
                require: false
            }
            console.log("error: ", err);
            result(null, require);
        }
        else {
            const require = {
                res: res,
                require: true
            };
            result(null, require);
        }
    });
};
Task.CheckremarkDoc = function CheckremarkDoc(code, result) {
    //console.log(" = ", code);
    var str = "SELECT `remark` FROM `tb_upload_document` WHERE `type_of_document_id` ='" + code.type + "' AND ID ='" + code.ID + "' AND `semester_name`= '" + code.semester + "'"
    // console.log(str);

    sql.query(str, function (err, res) {
        if (err) {
            const require = {
                error: err,
                require: false
            }
            console.log("error: ", err);
            result(null, require);
        }
        else {
            const require = {
                res: res,
                require: true
            };
            result(null, require);
        }
    });
};
module.exports = Task;