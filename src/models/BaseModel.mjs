export default class BaseModel {
    constructor(types, fn) {
        this.DataTypes = types;
        this.fn = fn;
        this.schema = {
            id: {
                type: this.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                desc: "شناسه"
            }, pid: {
                type: this.DataTypes.INTEGER,
                desc: "مرجع"
            },
            ord: {
                type: this.DataTypes.INTEGER,
                desc: "ترتیب"
            }
        };
        this.paranoid = true;
    }

}