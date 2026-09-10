\c postgres

DROP DATABASE IF EXISTS cerca;
CREATE DATABASE cerca;

\c cerca

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


-- CIRCLES
CREATE TABLE circles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- CIRCLE MEMBERS
CREATE TABLE circle_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    circle_id UUID NOT NULL
        REFERENCES circles(id)
        ON DELETE CASCADE,

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    role VARCHAR(20) NOT NULL DEFAULT 'member',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (circle_id, user_id),

    CONSTRAINT circle_members_role_check
        CHECK (role IN ('owner', 'member'))
);


CREATE UNIQUE INDEX one_owner_per_circle
ON circle_members (circle_id)
WHERE role = 'owner';


-- CIRCLE INVITATIONS
CREATE TABLE circle_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    circle_id UUID NOT NULL
        REFERENCES circles(id)
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

    CONSTRAINT circle_invitations_status_check
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

CREATE UNIQUE INDEX unique_pending_circle_invitation
ON circle_invitations (circle_id, invited_user_id)
WHERE status = 'pending';

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
        CHECK (
            accuracy_m IS NULL
            OR accuracy_m >= 0
        )
);

-- LOCATION HISTORY
CREATE TABLE location_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    device_id UUID NOT NULL
        REFERENCES devices(id)
        ON DELETE CASCADE,

    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accuracy_m DOUBLE PRECISION,

    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT location_history_latitude_range
        CHECK (latitude BETWEEN -90 AND 90),

    CONSTRAINT location_history_longitude_range
        CHECK (longitude BETWEEN -180 AND 180),

    CONSTRAINT location_history_accuracy_positive
        CHECK (
            accuracy_m IS NULL
            OR accuracy_m >= 0
        )
);

-- ÍNDICES
CREATE INDEX idx_circle_members_user_id
    ON circle_members(user_id);

CREATE INDEX idx_devices_user_id
    ON devices(user_id);

CREATE INDEX idx_devices_active
    ON devices(is_active);

CREATE INDEX idx_current_locations_updated_at
    ON current_locations(updated_at);

CREATE INDEX idx_location_history_device_id
    ON location_history(device_id);

CREATE INDEX idx_location_history_recorded_at
    ON location_history(recorded_at);