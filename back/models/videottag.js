import { DataTypes } from 'sequelize';
import { sequelize } from '.';
import Video from './video';
import Tag from './tag';
const VideoTag = sequelize.define('Tag', {
    videoId: {
        allowNull: false,
        type: DataTypes.UUID,
    },
    tagId: {
        allowNull: false,
        type: DataTypes.UUID,
    }
}, {
    tableName: 'VideoTag',
});
Video.belongsToMany(Tag, {
    through: 'VideoTag',
    as: 'tags',
    foreignKey: 'videoId'
});
Tag.belongsToMany(Video, {
    through: 'VideoTag',
    as: 'videos',
    foreignKey: 'tagId'
});
export default VideoTag;
