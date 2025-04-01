import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions"
import * as anchor from '@coral-xyz/anchor'
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {Votingdapp} from '@/../anchor/target/types/votingdapp';
import { Program } from "@coral-xyz/anchor";

const IDL = require('@/../anchor/target/idl/votingdapp.json')

export const OPTIONS = GET;

export async function GET(request: Request) {
  const actionMetaData: ActionGetResponse =  {
    title: "Vote for Merc",
    description: "Vote between Merc and BMW",
    label: "Vote",
    icon : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQBCgMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAACAAMEBQYBB//EAEUQAAIBAwICBwMICAQGAwEAAAECAwAEEQUSITEGEyJBUWFxMoGRFCNCUpKhsdEVM0NigsHh8CRTcvEHRFRjstI0c4QX/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/xAAdEQEBAQEAAgMBAAAAAAAAAAAAARECEiEDMUET/9oADAMBAAIRAxEAPwC6/hNGDQF/9Vdjxv8ApfCopzGeIU/aoBEzMTxHvp3cE5g0l2txWgFRtHGu7d30zRoAc5rjBRyLUHApB78UuIPsnHjRknAxzpkStkqTwqaYcPZHa4+tMjJziuS7pEBViKHqjy3nHfRcEHKvhQPeaNCxBbco44wONMtCpGcipcUeyNeyANo7u+gaZmxwcD3Uce7bxdT7q64GOQroAKeFBzOObgV0L9LduB8KFlGzhRx5C8KgXADiAc8s1zIXnS3ce0K6xB+jmigZsnOwYA8KGJcgncME8qROe40aquPZpAaqoPACnGKqBkc6Bcd/Cibu8KqV1TxI28POk4UoDjjnuOK6MbuJoJ1UEMGPLiKVDUZGSccfEV1MZLEMfUV2FQqkFqIqgQgtU/GjDyIMgsy58s0SuGHF5G939KEICdwkxiky9oUCmYAciPvpKwPaMxIoGU7+dErez2j8KgZmRjuBkON2M7aBI+8Nhu/I4VL2ySDtNigMD57UpNAxtlyzFsJjnnnTPUueIZvtGpm2RARw258KLI+utASR/X/pXM7PZU0kKunt0gq/XrSDGe9aFT2+C4oyRtGW4VwLx4ez3UDqcuFA27Pf8K6Q/wBFuFDlhw3c6AsHHaHCjggZz2EzVZ1891cNbafgLHwkmYZVD4AZGT6cPfwpy20+Oa9aAyySJGuZZXC5ZjyXGMefjy8a68/H+ufXeLJ7SWNf1Wf4hXVspSvsxj1kFQL+aa3sOqimw6zrGGHawpPn61oItMfaN1wxGBgVm8yNc21W/IZOO4Qn+I/lXVtJyvOHHhuP5VajS075mz7x/Ou/oyMftXPox/OpkX2pzYzH6UQ/jP5Vz5BN9aI/xn8quf0ZG3N5cetR2tFR2Vyi45bzjNPRlVpsJ+7qvt/0rhtJ4wSY/fuA/nU14YmBUqrg8+PCmjoGlzzossFvIHPEjiRT0nv8V0koQ/OlAPORT/OmnvrYcC+R+6Cfwq1m6E6LIrKttsz9Jdy4++sF0q6FappEb3emXc11aj21K9uMenePOr4xLe41MMsM/GKUSDvCMOFOLIwOAnZ7jXkkV5dIwZbt4ZBybjj345Vq+j/SifettrSx4Y/NXMfsn186l5xnn5J16bUEHiTRKy8t1MxsJMMGDA94pzHHHjWXQ7uGOBPqKblOVA8eNd3sMBThfpGhnkwRufOeVKscJUjJHGh7qcXkMtxoJSuRvmXyHjUUAlC9n8QaCZtxXDAZ4UZ2t+2B81/3roVu5v7+NA27qntuKMlWdMPSYN9Hd/q/vnRja77qBdn69dbgntCk5b61MDeIyyN2ic5oOh+HNaWB4D4U0ryYwjJknJ7NOfO/WT76CVKPpUlCv3H7NCq/vPToK/vVUNyYX6DfCuxIrIpx491AzDd7T0TMSowTUDhjHeMiqfWLh1/wtm2J5MAtz2A8B76m3t8lpaySysQEUsT6VU6Pulb5RccHYda5Pczch7l/Guvx87dc/k6yLaIR6bpqxjJWJMcDksfH1Jqdp8Bt7SNZCDM+WlYcix4n3DkPICq2QwyzxZuF2RyB2UfSxyHxwfdUoahC0E0obKwF1fy2kg16Nl9RwuomqvmO3/7l8v3f7Vtw2OFefalJmDSWPAvebj95reK1efv7en4/pIDUs00Diuhqy6HBXGVWxuAPqK5urmaAmhiOOwpx+6K6Aq8FUL6CuZpA0HTTUgz3eVOZoW40R5B/xI6MLp041KxjxazP84i/s2/I93vFY+VTbJG6Zks5QMEnl6+de/6pYw6jYT2lwMxyrtby8x514lJaPp2pXmiX6jG47fA4/PnW5Xm+bjPa16Oa7JA6WlxKTEPYYnNbSOU53s6EEZ2nka8subRrVNvErx2N4EceNabonr4bFpdvwTgCe6sdRr4u7Y2e6R1RnK5DfRGR/f5UpO2W7XfVXq+t2+mRTyuDMsG1pUj5orE4bFDpGu2OqIfktwC3Nl5MPcazjrq8jGExlaamXOG3KNtD12BuX8a48jMq5PDPCkV0D6rjPvoicMFPf60s+4eIpuaYCVQxz4ceNA6W7fNd3xrigJ9Nfj/SuKwHNQO/jXe3sXYqn1PjQDIzf2c0g3YpmUN2ty8cdxo0TCDgQDz41lQSSYU+lRevf+yafnWMHDEZ9aa6sfXHwoLFGfZjx5U+jdjBJJ7zmmVZRzkJyeHDlSV148G58KoNl9aTqsSZLEY5YHOi2qeIyfSq2TUmUzyx2/ygw8Y4Q4XcB4HlnwrfE2s9XIcutNS/gCXhZIjgsgzxxWe6YR6haxQ/oaF7qIktL1ZwwPdwPOtJY34ktEMiXCO/aKXMiuyZ7sqAPgPjTN/ODiO1ktDcEg9XcziPcveVzzPlXfMnpxt15gdR1mKQdfp1/Fx4l7d+H3VfaLqNpLotxYS6h/i5pJJWBUoxyc4GefhWyCNHxhfaccRzqg6UaPJrMlvLMyZhOQuCMknnkfzqZZ7NlntZxW0ms6NYywyKksbrKEPAZx31r7aS6aIZEePU5rNaBAbe2VeGAMEZ4ir2LO0FHJHlWeprXPWJwecczH8DS62XvMY9x/OmRI4GCKINnnWfFvyO9bJ9eP7J/Oude45yJ9mmjQkeIp4nkJ3viSY7qAJ3AxZx99B1moDnd2+P/pP503LEzKQJGTP0k5r5j8qh211PHcfJtQjBP0J0GFceY7jTxPKp7XN4v/OWqnziP50ydY6k5uLy2IHPbGc/jRkBh3H3U1JEhBBiQ/w08U8qhXvS+KEHqoTcHyUqKxnSWGbpTqUF3aQJb3UY2nJ3dZg8PDxNaHVLZoDuKLtPI4qtMpU5VdvpWsjn13b6rOXkF/YzNBqEW3rB7Dowz6VWWmiahJfJJbkKmNpyDngOBz/ffXpNpqsN5CbLV41mgbgHx2k8wardajfSZE2y9Zbyfq5OYbyPnUw5kjJ69p2ow9ZfXEyjrLb5PPHksGGCBt4ZNUPRuy1gapay2dnchd4DSFCi7c4PE8OXdW+W/PgpDeJNTLG7EQyqqV5mNeXuqXfxqdTV3F7BYZ4cKIEgp4D0pmK7tboAxYYeG7FPrGvemR7q5uu64ZQOGB61xIw7l3gBOOBGKRjjZwNi4NONGixkKhz/AKhQBKqAdoL8KD5vsr1PA8/791CseV7absc+XGha2iX9jKx8mP50qnA6OWGxto5HupFI9mVQ8OfH8aCKNHOGjlXHg39addYhlR1vHn2jUERynWhjjaR9Ki62D937VBJbowLMXwOGMmmTawg4PXfd+VBYDGQMnj+7UjPZxuOfSh3AMSVwBwGaNCM5AxnligCduohdwRwjZveBWWlvIk00GGQMyuA2D38a0GuTiDSbqbPBImNeU9H7m5nt53nfcrtmP48R6V0+O459tZHqso5mpP6RguFjW7ijl2NvXcoO1vEVnlc0Yeunk542MOpRtwDc6lJMknIisQsjDkSKsNOvZVcLuyPOtTpmxrooiu14shiedSflGGJ37W+t3H1FYGDpwn6beyJPVg7A30SfCr69verjE7LvRTllzgCrPZ9NTbapZuNklxAkg4MDIOflU5GSQZjZWH7pzUPQXTWY1is7XT87N7LJbKQBw++mNbgtdOuo4LjQ0Z35SWMjRn4CuV+8dZdi09K5uAzuOKy36VsxI6QapqNm6na0d5CJlU+BPAin2v79Y3nEdrqUEY3MbSfayqOZKN+dDWhZ0H0hSBz7IJHkKpdH6TW+owCSCCdYzyLJgH0IqfPrllbgfKJ44vDrHApYupfP6Le8V3Yx5x494qlk6YaLEMtfQ+5s1HPT3RBjbdhs4xtVjnPLu7+6p7PTQvbrIhWRMg92aqp9FXJ24x3VWN/xD0UDIkc8M/qzyztz8eHrTL/8SNGGSS+Vbafmu/wp7PSVNohB7I99Rrqzna1a2mXrI85APcfHND//AEfR2OGMgHHgYj3Un6faA4O6QKBzypGKqZFW+mshOFIXuooIupLFuQFSZul2gTAiK6jz64qn1fXYZIGS1cOCMZU5qsWIkM8kcrPC5BJyMGri06QG3wuonCZ4yA4x61ATSXtYFm1K6+SqUEnVQxNNLtPfgcF9Sa03RLozBrMT3GnWSxsm1ku9UHXMykHDKgIUcqxcrUliZFJFPGJo5t6MMqy8iKMtzwWxjwqi0mS4tNa1LQ72RZZbdzIHQAA5Y5Ax3eVXXZjBUI5WsfTrLolXeOKnn3kilLuIwycPiaJMOnzasPWjELLzdj76VUaNF3NuLHwxTqKh3K+dwPEnnRsnV/TPwoQq4JGe1WRHZVBYknhy86jfKieJQ5PPhTtx7ALudviO6mt0H+c32qCzQbk+dA7+VIgBcKvEcs4qsGtQhcG2cH3fnXRq0Z4iyl9+PzqhjprIY+iuosvMREHj515zp8ptoreBuAQKMbcZ38D8CPvNbrpVeNd9HNQt1t3XfDzyOHHP8q891VTFFA6Sb98PGQcNxySCB58TXThjtoeqIGccKQTPCn7G5W4t45VwdygkeGRTzRq/sjBrbCII8etFvaCCWQKSyxswAGScCn9uzgRVTrl6yFbSGbqsoZJph+zXv/vzHjRGettNSORetaa5vfb6mBS2DnmccTxr0azl620jE8TK23bJG68R5EGvPr2ST5PeWVuOpjjCzx7DxnTvZj9Lgc+AxjFa3RZSFeLJOG4eA4CnFO15YWN7ZFH0fUGttpG0MucDwz4Vy4t+l8t9DO2ownY24ush3dw5FfAVc6SB1YLcvOrVjCOBZQR3ZrVjMrLrP0ttrW7s7QwSw3LOxaeJC+WPHtbh+FM9H9C1Oytmt9QuYYLOT9dBES7z/wCtz3fuj+lasmEgkMD76zHSvVJLdOqt227h7eeVTF1W9JOkc0ZbSujsMpaLsyyQR7jGfqjA5+fdWMeLUZZDJLY327nkwOxIPM8Rk+Y7xyxio8kF5bPj56LKHLJkFuOQcjzzjHjx4V0X+oIxxqN4oJJHz7LxxxPP+gPKs3a3MPi3vQ+DY3oOQcG2Y4wOPHGfQ9/Khe3vduPkNznaFANu4789w/DlyFKHU9YLAJq96AACcXso/n/WkNY1vbhdZ1EYHfdzYPH17/x8qilDaup63UIpYLZAzSfNlHYHuUHkW4DPIZB55p2TU0k0u4MNhZwRpIke0Qhjg+JPFvUmob3d1dz51C7urhXXq+tmlcsq7gQdxzjBGD3ccjPGpYutbniWxs9ORbAE4to4QY2zzZmPFj+9n0xyoIKr12z5LbyMzrwREaQgqeIA+/8AGha0uiSTZXPtf9O/L4f7nnTs8jabsh027mjdEPWvbyMBuY8gw5gcvCoz6hqPH/H3Yz4XD4/H8aBNZ3OMtaXIU/8AYb4Zx/uedBHFdwsHhtrlDz4RNj8K493eO3zl9ck545nb+dN7J5uHzsuffUHoPRzptqNrpiww3vVSodkkU0W7cnkTyI8Ka/Sd/BNLLbazPGm0rEnEEIQezwGOGTjlzrH29rJaxh5RtZyNsRHHA5nFaWDqWtwZHUHbyzVkZqR0b1Db0liM8ryTXAZJJG45J48/d4d9egybioAOMH6OK8sTqv0jbtFIpIkwTnlWq6Ha62o2L2ly6/K7Xskvw3jlms9RvitdkFcZJ9cUhJHnDyEe+gWaNQMzRfGgiWPdkzg/xCsNpCSQSg7JV4eYpStCgXDHOPGkiomNpj89pApSBNwYumfDhUEeeSELtlICnjUbFh4/38akSICCu8LnkRgYNNCDxuD9r+lBDCEHG8N91F1UZXjGpNO/JzuztHxoigXmoFbw1B1CCA6fdDYdxhbhjyNeeavHt6P2txhAxkYAxZCcRzCnlxU/2a9Lu03WsylRxjYcvKvLNdmJ0eCJj7M0g4cM8u73mtcMdpvROaRrYjg68iAe0vurQq4PAHjWK6I3UUOoCOedIVfgHk5CvTItG+Wp1lrNbXXD6DA/hW4wrUBJA5Z7/CsZfXBY3E72rzwXMzI5H0UXGMHxyT9kVvZ9MurRsSxyxeG4ZU++vPSpjht5Rfi27D9ntHj1r8ccjw/CpSJuj2qPCjpJ10CkrDKw5Kfajfw8R3Zq6slWGZQsiuQAjkc8jvPnjFRtNU3WlnqLgyNx+ea2wJD4DiMn0zVtdo9tbIJep6qBezJEoAbAyc+YpFpatrksSPaWU3UiOLrLm4Iz1a9wA72PdXn8upS3LM0rXEjZ9p5myfyqVrF0/wCj4Yx+su3NzKfrfUHuFV0PBBgHHpmlqSHku5EG5JrhGHILM4o21S5J43Fz/Ed33mmwQeak/wANW2jaJqWsMPkFqGiBw0r5Cj309r6V8Gr3CNiJ5MA52g4Un0qWdVu1UvIp29+6FP5Ct5ZdDtK0i2N1rd6Ni8TkhEHp3moN/r/QuHckFhcXC5wdowp9M0NZKz1VLy7hhMULbm7WYyDjHr5VrNO0rSryHfLbMrtKURI+PJQSeJ54PLvxVBea/wBHnXNpolxDIDlX6wcKkQdMrRLWS3ktbrZI+5hGQAeCj49nmPGuvF+P+dl+3PqdXuZ9NPf9FdEsRGZ2wrSKm5R7BwcZ4+AI8qhWOgaNeH5NHFcrFt3bGbsk7Vb2c/vD31Xnp3p7S9a+mXJJl6whpBjOxl+GGpi26a2FtIXisbs89uZF4EqFJ+AFc9jWVbRdHtFZhG1pKhUkPuK/N8cc88eNHBoOiSGHqYnKyMAxYgbcsFGfMkjhVAOmdoESNrK6dUG3DTDtDOePvpL01tUZWXT52YOrktN7RUgrn0Kr8KbFyqK7v5Yrye3hC4jlZABGvIEjwqO+oXWCGlkQd4Ts/hitFB0q0YfrNA3SN7TdZzPeaavL/QdUwi2xs3PItyHvFZVmvlBzuJc558eNA7qwOU4/vNmrG80uW3G5fnIsZDKM8KrCB60qnLScwzq69kqQwx5Hj/OtF0fuFXpCvHs3DuMZxzy1ZmHPXqQM8eAq56NqX1+yCnG1+JPd2an4fr0WO0j37urB/iozbx98XwGacWPP7aI+hxTgts/X/gY1zdEcRoOYb76Irj2UJ9DTjQhf+qPoTQdVnmZR/qU0EeQPg9lh/EKYxJ/3Pt1LkiHeqH1OKa6pf8uP7VBpuqfvWMeuaWXT2+rX35pvG04KSbvAtxp1WbHsSe81tg28isChKdoYrxvpZJGL4wIGBjZi4b6zc8eXKvYL3csOQmDjwrzrW9GF9dPPPHcmRubF88Pf3VpGGOfDAPPA4Vsv+GsK/pGe6lZhFGm1c5xuPpUE9F1wWSZgfquoH4VO0JbnTnltZxbvA3FWc5Cn3VLqvUINViOI4r+NwOaNIGHwPKvLtStzAdQt1tkuZrS8LRI/s9W/ENge1xzz4Zbvq6e1a5G5ZbPhy27siqy8in0y6XUFkWZQhinVZGBaM8+PdjuPcRmkv4lkBpV7JZTs8jCa5hADtnsKxOFhTHAcfaI9PGrDVdSs2hEQWNUIdHAwpdt/aPrnNVq6YubWbSV62wjczy49vdg4BXy/nQabbXpWyWe1lZp1nWbIIwGbOT7wKv0gHi0SdrX5VLJJDCdhEJAk2Y4AqxHLxBNWyWfQdlAFzqMWByaGRv8AxzWc1o2sFlDYpskuInJknQ5H+nOOPP8AAd1UBOWwMmro9PsrPoNbSrO99JLjkksUuM+Y21N1bp1bWsHU6BZvOwGN7RmONPiONeb6DDazTt8vkuurA7KwHiTV3Ppejuezaah5Z/3qXpfFW6jf3OqTm41XUFeTkFLgqo8AoPCoLpblSFu4veD+VW/6Bhkb/D2VwcdzkUp9Ma1iZ5dIi2ge2JDke45qeRii6qIDjdQfBvyrnVxf9VD9lvypiUjcSBtB7qbpqpYjjByLiH1w35UmEZwTcxcvqN+VS+jQsW1FV1NA0BHepPH3VuYrPQiB8nslcd2bN2/lTR5xsj5/KE9yN+Vd2xZ/Xr9g16Ytnp3fosD/AP5CtONpmkzxNG2gqm8Y3pHgjzFTyHmASAOC1xjxHVmun5MP2rNk/RUjNStc0W60m4ZXRjAT83JjgR5+BqvjkMT5KJIPqvxBq6LC11JrU7R27c/s2OSPQ1NN1or9o2cpc8SABz+NUrzRG3jRbdVkViWk3E7vAY7sU0eXnTUxdtNYb0MVn8nAYHrWYbgPTNXPQaykudRudS2BUXKIG5Anu9wxWY0rTJ9TuFgto+/tueSjzr0+wtLXT7KK2iicBB7QPtHvNS1cWPV3A5qh/v0rmxx+yb3MtRiYD9F/iK6CPoqR64rLR/cfpy3C+/8ArTRkUezcXJ9a6JZu6NW/1KKTSz/5EH2aBpst9En1/wB6Daf8v+/jXXaU+1DEP9K0Pa/y1+FBtSqM2Soz499A8SHkWHqc0OU7wH9ARTbS4/YEepx+NdNjJi6s+sQgucEY4cKz150WjdBtmnYjjxbjV3f6j8mt3k6gHaORfAPvqgfpOy4PyNBnu6zNWJUJ9BeDgI7hh47qiy6aTndDMMeJq8j6Qu4GbXAPgCaJdWLH/wCO/Hu2GqjI3Gk8ykUtVs+mlCT8nyccOxW5mnWbO6GdM96gjFVjWDvKWjuHx4SIRUxdZNLXU7d+tsVmiJ57WK1y8n16eMpcNMyEYxvOD6jvrZLYzq6kglQDkjJqIerY20fXfOPuARlKsxB48Digwk1rdYz1LDxoIrSQnJHuPCtLqDwo5je6ZWUnI6rl99RY5LYHBvWPmYf61mrFatlKDuRghHIgnNO7tVQ5W7nPrIT+NXMa27D9esi+UYH86TW1meTzKfIZ/nUFQL3V0wRdT8POnZdXneBo7r5SxYY/W5Bqb8hRj81co3k+VNE2l3AQkwqw7irBvwzQZVhkng3wocHwPwq7MCBypmtw31S/Ee7Fd6lB/wAxbD1ZvyoKuwjD3ADhtvft51ora41G1XZp1xfKPAYP41EigQsNtxbFs9xb8qnw/KLduxPHjyz+VA6uqdKwMJLcv5PGlPxax0oj43Cybe/aqg/fRLqEy/8ANKvqpNcbUbwew8EnlnGfiKYqTLr8HUmPVWvu0OMZjRgfgKxOpPay3BOn2zxRjvY5zVzfnUJzvm05mHijbv8AxNQYOrW4SKe16os2MyFh9xoinMUg+ialacLdJgb6B5Ic8kbBqykuIo2YKkHZfaOOffTfylJMZtIXz3hMmqN1ot7pKWixWPUooHsFDmrZJ42GRCregNefaTdy2lwJLe3kwPokEj4GtnZa3Ncr27VE9xFZVO69f+l+6iLo37FV9a4t430lRfvp0P1nJ4xUIb6vP6sqP4qBoJ/r5/iNPNDu5MnuFAbVgOzJj0FFRzHKOeD76Da31B8ada3f/MrnVP50GlWIDkzfGpSRAH2nPqaVKtsu9WufDOc1W6rZrKgXrJYyeG5GwR50qVaiV59qFze2moNAl/cumcdtxn7hRpdXJ9q4lb1Y1ylVQRuJTwLt8aYWeQhiTkg8M0qVBYafM+5STmp8s7qyghXAPAMuRSpVAT6FpupwoLi2C7eIMTFPwNUuraBptjD1kUDMQcYaRsfcRSpVnpVRDJDtyLSEd3tP/wC1SeshAH+Dg+L/APtXaVQLroTnNlbnbyzu/wDamv0kYj81aWykd4VvzpUqqnhrU1wvV3Fvayp9V4tw++n4tL027wWsYoye+FnT7gcUqVVEiXonYQlHjmuhnjjep/lTq9H7Ycp7jHhlfypUqAm0K2VQesm9Mr+VBJpNsoODJ9qlSoIwsrePtBG9N7fnT8M/U5EcY4DvZj+JpUqgnwstxhXiRRjPYyD+NFdaPC0RaO4uoj+5L+eaVKsqx2pvc2lz1aXtw6gkdth/IVoOixa64TMW9aVKqNMYI15LTRhjb6PwpUqiwyyBeRPxpou/12+NdpUhQF2JAyePnRbf32+NdpVUf//Z"
    ,links : {
      actions : [
        {
          label : "Vote for C class",
          href : "/api/hello?candidate=cclass",
          type : "external-link"
        },
        {
          label : "Vote for S class",
          href : "/api/hello?candidate=sclass",
          type : "external-link"
        }
      ]
    }
  };

  return Response.json(actionMetaData, {headers : ACTIONS_CORS_HEADERS})
}

export async function POST(request: Request){
  const url = new URL(request.url);

  const candidate =  url.searchParams.get("candidate");

  if(candidate !== "Merc" && candidate !== "BMW"){
    return new Response("invalid candidate", {status : 400, headers : ACTIONS_CORS_HEADERS})
  }

  const connection = new Connection('http://127.0.0.1:8899', "confirmed");
  const body: ActionPostRequest = await request.json();
  let voter = new PublicKey(body.account);
  const program: Program<Votingdapp> = new Program(IDL, {connection})

  try {
    voter = new PublicKey(body.account)
  }
  catch(e){
    return new Response("invalid account", {status : 400, headers : ACTIONS_CORS_HEADERS})
  }

  // grab instruction
  const instruction = program.methods.vote("Merc", new anchor.BN(1)).
  accounts({
    signer : voter
  }).
  instruction();

  const blockhash = await connection.getLatestBlockhash();

  const transaction = new Transaction({
    feePayer: voter,
    blockhash : blockhash.blockhash,
    lastValidBlockHeight : blockhash.lastValidBlockHeight
  }).add(await instruction);

  const response = await createPostResponse({
    fields : {
      transaction : transaction,
    }
  });

  return Response.json(response, {headers: ACTIONS_CORS_HEADERS})
}
