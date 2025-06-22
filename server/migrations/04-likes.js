export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('likes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      albumId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'albums',
          key: 'id',
        },
      },
      artistId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'artists',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('likes', ['userId', 'albumId'], { unique: true });
    await queryInterface.addIndex('likes', ['userId', 'artistId'], { unique: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('likes');
  },
};
