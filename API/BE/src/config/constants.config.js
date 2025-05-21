const fileFilterType = {
    IMAGE:'image',
    DOC:'doc',
    VIDEO:'video',
    AUDIO:'audio'
}

const UserRoles = {
    ADMIN: 'admin',
    CUSTOMER: 'customer',
    SELLER: 'seller',
}

const statusType ={
    PENDING:'pending',
    ACTIVE:'active',
    INACTIVE:'inactive',
    SUCCESSFUL:'successful',
    FAILED:'failed',
}

module.exports = {
    fileFilterType,
    UserRoles,
    statusType
}
