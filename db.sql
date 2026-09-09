\c postgres

DROP DATABASE IF EXISTS cerca;
CREATE DATABASE cerca;

\c cerca;


CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FAMILIES
CREATE TABLE families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FAMILY MEMBERS
CREATE TABLE family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    family_id UUID NOT NULL
        REFERENCES families(id)
        ON DELETE CASCADE,

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    role VARCHAR(20) NOT NULL DEFAULT 'member',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (family_id, user_id),

    CONSTRAINT family_members_role_check
        CHECK (role IN ('owner', 'member'))
);

CREATE UNIQUE INDEX one_owner_per_family
ON family_members (family_id)
WHERE role = 'owner';

CREATE TABLE family_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL
        REFERENCES families(id)
        ON DELETE CASCADE,
    invited_user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,
    invited_by UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,
    token UUID NOT NULL DEFAULT gen_random_uuid(),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    expires_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW() + INTERVAL '7 days',
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT family_invitations_status_check
        CHECK (
            status IN (
                'pending',
                'accepted',
                'rejected',
                'cancelled',
                'expired'
            )
        )
);

-- DEVICES
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,
    device_name VARCHAR(100),
    platform VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ
);

CREATE INDEX idx_devices_user_id
ON devices(user_id);

-- CURRENT LOCATIONS
CREATE TABLE current_locations (
    device_id UUID PRIMARY KEY
        REFERENCES devices(id)
        ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accuracy_m DOUBLE PRECISION,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT latitude_range
        CHECK (latitude BETWEEN -90 AND 90),
    CONSTRAINT longitude_range
        CHECK (longitude BETWEEN -180 AND 180),
    CONSTRAINT accuracy_positive
        CHECK (accuracy_m IS NULL OR accuracy_m >= 0)
);

-- ÍNDICES
CREATE INDEX idx_family_members_user_id
    ON family_members(user_id);
CREATE INDEX idx_devices_user_id
    ON devices(user_id);
CREATE INDEX idx_devices_active
    ON devices(is_active);
CREATE INDEX idx_current_locations_updated_at
    ON current_locations(updated_at);