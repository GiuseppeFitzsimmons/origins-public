import { Model, ModelDefined, Optional, DataTypes, BelongsToMany } from 'sequelize';
import { sequelize } from '.';

const Tag = sequelize.define<any>(
    'Tag',
    {
        id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.UUID,
            unique: true,
        },
        value: {
            allowNull: false,
            type: DataTypes.TEXT,
            unique: true
        }
    },
    {
        tableName:'Tag',
        
    
    },
    
);


export default Tag;