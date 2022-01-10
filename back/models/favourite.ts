import { Model, ModelDefined, Optional, DataTypes, BelongsToMany } from 'sequelize';
import { sequelize } from '.';
import Video from './video';
import User from './user';

const Favourite = sequelize.define<any>(
    'Favourite',
    {
        videoId: {
            allowNull: false,
            type: DataTypes.UUID,
        },
        userId: {
            allowNull: false,
            type: DataTypes.UUID,
        }
    },
    {
        tableName:'Favourite',
    },
    
);

Video.belongsToMany(User, {
    through: 'Favourite',
    as: 'users',
    foreignKey:'videoId'
});

User.belongsToMany(Video, {
    through: 'Favourite',
    as: 'videos',
    foreignKey:'userId'
});

export default Favourite;