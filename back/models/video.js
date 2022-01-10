import { DataTypes } from 'sequelize';
import { sequelize } from '.';
const Video = sequelize.define('Video', {
    id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
    },
    name: {
        allowNull: false,
        type: DataTypes.TEXT,
    },
    description: {
        allowNull: true,
        type: DataTypes.TEXT,
    },
    url: {
        allowNull: false,
        type: DataTypes.TEXT,
    }
}, {
    tableName: 'Video'
});
export default Video;
