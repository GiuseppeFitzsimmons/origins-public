import { DataTypes } from 'sequelize';
import { sequelize } from '.';
const User = sequelize.define('User', {
    id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING,
        unique: true,
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING,
    }
});
/*
User.hasMany(Video, {
    sourceKey: 'id',
    foreignKey: 'videoId',
    as: 'video',
    onUpdate: 'CASCADE'
});

Video.belongsTo(User, {
    foreignKey: 'userId',
    as: 'video',
    onUpdate: 'CASCADE'
});
*/
export default User;
