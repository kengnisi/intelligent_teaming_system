CREATE TABLE `user` (
  `username` varchar(256) DEFAULT NULL COMMENT '用户昵称',
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `openId` varchar(256) DEFAULT NULL COMMENT '微信用户返回的openid',
  `avatarUrl` varchar(1024) DEFAULT NULL COMMENT '用户头像',
  `gender` tinyint(4) DEFAULT NULL COMMENT '性别',
  `phone` varchar(128) DEFAULT NULL COMMENT '电话',
  `email` varchar(512) DEFAULT NULL COMMENT '邮箱',
  `userStatus` int(11) NOT NULL DEFAULT '0' COMMENT '状态 0 - 正常',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isDelete` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否删除',
  `userRole` int(11) NOT NULL DEFAULT '0' COMMENT '用户角色 0 - 普通用户 1 - 管理员',
  `tags` varchar(1024) DEFAULT NULL COMMENT '标签 json 列表',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COMMENT='用户'

-- 标签表（可以不创建，因为标签字段已经放到了用户表中）
create table tag
(
    id         bigint auto_increment comment 'id'
        primary key,
    tagName    varchar(256) null comment '标签名称',
    userId     bigint null comment '用户 id',
    parentId   bigint null comment '父标签 id',
    isParent   tinyint null comment '0 - 不是, 1 - 父标签',
    createTime datetime default CURRENT_TIMESTAMP null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    isDelete   tinyint  default 0 not null comment '是否删除',
    constraint uniIdx_tagName
        unique (tagName)
) comment '标签';

create index idx_userId
    on tag (userId);


-- 消息表
create table message
(
    id         bigint auto_increment comment 'id'
        primary key,
    userId     bigint comment '用户id',
		name varchar(256) DEFAULT NULL COMMENT '用户昵称',
		avatarUrl varchar(1024) DEFAULT NULL COMMENT '用户头像',
		
    teamId     bigint comment '队伍id',
		style int      default 0 not null comment '0 - 字符串，1 - emoj，2 - 图片， 3 - 文件',
		createTime datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    message varchar(1024) not null COMMENT '信息内容',
    isDelete   tinyint  default 0 not null comment '是否删除'
) comment '消息';