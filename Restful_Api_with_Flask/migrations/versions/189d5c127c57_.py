"""empty message

Revision ID: 189d5c127c57
Revises: c59d99206735
Create Date: 2022-11-24 17:24:53.089425

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '189d5c127c57'
down_revision = 'c59d99206735'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('items', schema=None) as batch_op:
        batch_op.add_column(sa.Column('description', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('items', schema=None) as batch_op:
        batch_op.drop_column('description')

    # ### end Alembic commands ###
